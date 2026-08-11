import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.models.js";
import UserActivity from "../models/UserActivity.models.js";
import { serializeUser } from "./getuser.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const questionsPath = path.resolve(__dirname, "../data/questions.json");
const topicsPath = path.resolve(__dirname, "../data/topics.json");
const questionsData = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
const topicsData = JSON.parse(fs.readFileSync(topicsPath, "utf8"));
const topics = topicsData.topics || [];
const totalQuestions = Object.values(questionsData).reduce((total, questions) => total + questions.length, 0);
const USERNAME_PATTERN = /^[a-z0-9_-]{3,30}$/;

const normalizeUsername = (value = "") => value.trim().toLowerCase();

const getTopicSummaries = (solvedQuestions = []) => {
    const solvedByTopic = solvedQuestions.reduce((acc, question) => {
        acc[question.topicId] = (acc[question.topicId] || 0) + 1;
        return acc;
    }, {});

    return topics.map((topic) => {
        const total = questionsData[topic.id]?.length || 0;
        const solved = Math.min(solvedByTopic[topic.id] || 0, total);
        return {
            id: topic.id,
            label: topic.label,
            order: topic.order,
            solved,
            total,
            percent: total > 0 ? Math.round((solved / total) * 100) : 0,
        };
    });
};

const getPublicSummary = (activity) => {
    const solvedQuestions = activity?.solvedQuestions || [];
    const dailyActivity = activity?.dailyActivity || [];
    const solvedCount = typeof activity?.solvedCount === "number"
        ? activity.solvedCount
        : solvedQuestions.length;
    const activeDays = dailyActivity.filter((day) => day.solvedCount > 0).length;
    const recentActivity = [...dailyActivity]
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, 12)
        .map((day) => ({
            date: day.date,
            solvedCount: day.solvedCount || 0,
            submissions: day.submissions || 0,
        }));

    return {
        solvedCount,
        totalQuestions,
        totalSubmissions: activity?.totalSubmissions || 0,
        activeDays,
        lastActivityAt: activity?.lastActivityAt || null,
        topicProgress: getTopicSummaries(solvedQuestions),
        recentActivity,
    };
};

export const getPublicProfile = async (req, res) => {
    try {
        const username = normalizeUsername(req.params.username);
        if (!USERNAME_PATTERN.test(username)) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        const user = await User.findOne({ username, publicProfileEnabled: true })
            .select("username name avatar bio profileUrl publicProfileEnabled createdAt")
            .lean();

        if (!user) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        const activity = await UserActivity.findOne({ user: user._id }).lean();

        res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
        return res.status(200).json({
            success: true,
            profile: {
                user: serializeUser(user),
                summary: getPublicSummary(activity),
            },
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Unable to load public profile",
        });
    }
};

export const updateMyProfile = async (req, res) => {
    try {
        const updates = {};

        if (Object.prototype.hasOwnProperty.call(req.body, "username")) {
            const username = normalizeUsername(req.body.username);
            if (!USERNAME_PATTERN.test(username)) {
                return res.status(400).json({
                    success: false,
                    message: "Username must be 3-30 characters and use only letters, numbers, underscores, or hyphens.",
                });
            }

            const existing = await User.findOne({
                username,
                _id: { $ne: req.user.id },
            }).select("_id").lean();

            if (existing) {
                return res.status(409).json({
                    success: false,
                    message: "That username is already taken.",
                });
            }

            updates.username = username;
        }

        if (Object.prototype.hasOwnProperty.call(req.body, "name")) {
            updates.name = String(req.body.name || "").trim().slice(0, 80);
        }

        if (Object.prototype.hasOwnProperty.call(req.body, "bio")) {
            updates.bio = String(req.body.bio || "").trim().slice(0, 160);
        }

        if (Object.prototype.hasOwnProperty.call(req.body, "publicProfileEnabled")) {
            updates.publicProfileEnabled = Boolean(req.body.publicProfileEnabled);
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            {
                new: true,
                runValidators: true,
            }
        )
            .select("username name avatar bio profileUrl publicProfileEnabled createdAt lastLogin")
            .lean();

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            user: serializeUser(user),
        });
    } catch (error) {
        return res.status(error.code === 11000 ? 409 : 500).json({
            success: false,
            message: error.code === 11000 ? "That username is already taken." : "Unable to update profile",
        });
    }
};
