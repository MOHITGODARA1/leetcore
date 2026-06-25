import mongoose from "mongoose";
import Badge from "../models/Badge.models.js";
import User from "../models/User.models.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { calculateLevel } from "../utils/gamification.utils.js";

const normalizeSlug = (value = "") => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const createBadge = asyncHandler(async (req, res) => {
    const payload = {
        ...req.body,
        slug: normalizeSlug(req.body.slug || req.body.name),
    };

    if (!payload.name || !payload.slug || !payload.description) {
        throw new ApiError(400, "Badge name, slug, and description are required");
    }

    const badge = await Badge.create(payload);

    return res.status(201).json({
        success: true,
        message: "Badge created successfully",
        badge,
    });
});

export const getAllBadges = asyncHandler(async (req, res) => {
    const { category, rarity } = req.query;
    const filter = {
        ...(category ? { category } : {}),
        ...(rarity ? { rarity } : {}),
    };

    const badges = await Badge.find(filter).sort({ category: 1, rarity: 1, createdAt: -1 }).lean();

    return res.status(200).json({
        success: true,
        count: badges.length,
        badges,
    });
});

export const getSingleBadge = asyncHandler(async (req, res) => {
    const badge = await Badge.findById(req.params.id).lean();

    if (!badge) {
        throw new ApiError(404, "Badge not found");
    }

    return res.status(200).json({
        success: true,
        badge,
    });
});

export const awardBadgeToUser = asyncHandler(async (req, res) => {
    const { userId, badgeId } = req.body;

    if (!userId || !badgeId) {
        throw new ApiError(400, "userId and badgeId are required");
    }

    if (
        typeof userId !== "string" ||
        typeof badgeId !== "string" ||
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(badgeId)
    ) {
        throw new ApiError(400, "Invalid userId or badgeId");
    }

    const [badge, user] = await Promise.all([
        Badge.findById(badgeId).lean(),
        User.findById(userId),
    ]);

    if (!badge) {
        throw new ApiError(404, "Badge not found");
    }

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const alreadyEarned = user.badges.some((item) => item.badgeId.toString() === badgeId);

    if (alreadyEarned) {
        return res.status(200).json({
            success: true,
            message: "User already has this badge",
            duplicate: true,
            badge,
        });
    }

    user.badges.push({ badgeId });
    user.xp += badge.xpReward || 0;
    user.level = calculateLevel(user.xp, user.stats.totalProblemsSolved);
    await user.save();

    const updatedUser = await User.findById(userId)
        .select("badges xp level")
        .populate("badges.badgeId")
        .lean();

    return res.status(200).json({
        success: true,
        message: "Badge awarded successfully",
        user: updatedUser,
    });
});

export const getUserBadges = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId)
        .select("badges xp level")
        .populate("badges.badgeId")
        .lean();

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json({
        success: true,
        badges: user.badges,
        xp: user.xp,
        level: user.level,
    });
});

export const removeBadgeFromUser = asyncHandler(async (req, res) => {
    const { userId, badgeId } = req.params;

    const [badge, user] = await Promise.all([
        Badge.findById(badgeId).lean(),
        User.findById(userId),
    ]);

    if (!badge) {
        throw new ApiError(404, "Badge not found");
    }

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const originalCount = user.badges.length;
    user.badges = user.badges.filter((item) => item.badgeId.toString() !== badgeId);

    if (user.badges.length === originalCount) {
        throw new ApiError(404, "User has not earned this badge");
    }

    user.xp = Math.max(0, user.xp - (badge.xpReward || 0));
    user.level = calculateLevel(user.xp, user.stats.totalProblemsSolved);
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Badge removed successfully",
    });
});
