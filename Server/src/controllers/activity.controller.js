import User from "../models/User.models.js";
import UserActivity from "../models/useractivity.models.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getRangeBounds, toDateKey } from "../utils/date.utils.js";
import {
    calculateActivityXp,
    calculateDailyConsistencyScore,
    calculateLevel,
    formatConsistencyWindow,
    getNextStreak,
} from "../utils/gamification.utils.js";

const getUserOrThrow = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};

const sanitizeActivityPayload = (body = {}) => {
    const studyMinutes = Math.max(Number(body.studyMinutes) || 0, 0);
    const problemsSolved = Math.max(Number(body.problemsSolved) || 0, 0);
    const sessionsCount = Math.max(Number(body.sessionsCount) || 1, 0);
    const topicsLearned = Array.isArray(body.topicsLearned)
        ? [...new Set(body.topicsLearned.map((topic) => String(topic).trim()).filter(Boolean))]
        : [];

    return {
        studyMinutes,
        problemsSolved,
        sessionsCount,
        topicsLearned,
        active: body.active ?? true,
        deviceType: body.deviceType,
    };
};

export const markDailyActivity = asyncHandler(async (req, res) => {
    const userIdCandidate = req.user?.id ?? req.body.userId;
    const userId = typeof userIdCandidate === "string" ? userIdCandidate : null;
    const date = req.body.date ? toDateKey(req.body.date) : toDateKey();

    if (!userId) {
        throw new ApiError(400, "userId is required");
    }

    const user = await getUserOrThrow(userId);
    const payload = sanitizeActivityPayload(req.body);
    const existingActivity = await UserActivity.findOne({ userId, date });
    const wasNewActiveDay = !existingActivity && payload.active;

    const nextStudyMinutes = (existingActivity?.studyMinutes || 0) + payload.studyMinutes;
    const nextProblemsSolved = (existingActivity?.problemsSolved || 0) + payload.problemsSolved;
    const nextSessionsCount = (existingActivity?.sessionsCount || 0) + payload.sessionsCount;
    const nextTopics = [...new Set([...(existingActivity?.topicsLearned || []), ...payload.topicsLearned])];
    const consistencyScore = calculateDailyConsistencyScore({
        studyMinutes: nextStudyMinutes,
        problemsSolved: nextProblemsSolved,
        sessionsCount: nextSessionsCount,
    });
    const xpEarned = calculateActivityXp({
        studyMinutes: payload.studyMinutes,
        problemsSolved: payload.problemsSolved,
        topicsLearned: payload.topicsLearned,
    });

    const nextStreak = wasNewActiveDay
        ? getNextStreak(user.stats?.lastActiveDate, user.stats?.currentStreak, date)
        : user.stats?.currentStreak || existingActivity?.streakCount || 0;

    const activity = await UserActivity.findOneAndUpdate(
        { userId, date },
        {
            $set: {
                active: payload.active,
                studyMinutes: nextStudyMinutes,
                problemsSolved: nextProblemsSolved,
                sessionsCount: nextSessionsCount,
                topicsLearned: nextTopics,
                streakCount: nextStreak,
                consistencyScore,
                completionRate: consistencyScore,
                ...(payload.deviceType ? { deviceType: payload.deviceType } : {}),
            },
            $inc: {
                xpEarned,
            },
        },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        }
    );

    if (wasNewActiveDay) {
        user.stats.totalActiveDays += 1;
        user.stats.currentStreak = nextStreak;
        user.stats.maxStreak = Math.max(user.stats.maxStreak || 0, nextStreak);
        user.stats.lastActiveDate = date;
    }

    user.stats.totalStudyMinutes += payload.studyMinutes;
    user.stats.totalProblemsSolved += payload.problemsSolved;
    user.xp += xpEarned;
    user.level = calculateLevel(user.xp, user.stats.totalProblemsSolved);

    const { startDate, endDate } = getRangeBounds(30, date);
    const activeDaysInWindow = await UserActivity.countDocuments({
        userId,
        active: true,
        date: { $gte: startDate, $lte: endDate },
    });
    user.stats.consistencyPercentage = Math.round((activeDaysInWindow / 30) * 100);
    await user.save();

    return res.status(existingActivity ? 200 : 201).json({
        success: true,
        message: existingActivity ? "Daily activity updated" : "Daily activity created",
        activity,
        stats: user.stats,
        xp: user.xp,
        level: user.level,
    });
});

export const getUserActivity = asyncHandler(async (req, res) => {
    const userId = req.params.userId || req.user?.id;
    const days = Math.min(Math.max(Number(req.query.days) || 30, 1), 365);
    const { startDate, endDate } = getRangeBounds(days);

    await getUserOrThrow(userId);

    const activities = await UserActivity.find({
        userId,
        date: { $gte: startDate, $lte: endDate },
    })
        .sort({ date: -1 })
        .lean();

    return res.status(200).json({
        success: true,
        range: { startDate, endDate, days },
        activities,
    });
});

export const getConsistencyData = asyncHandler(async (req, res) => {
    const userId = req.params.userId || req.user?.id;
    const days = Math.min(Math.max(Number(req.query.days) || 30, 1), 365);
    
    let endDateKey = toDateKey();
    const year = Number(req.query.year);
    if (year && year < new Date().getFullYear()) {
        endDateKey = `${year}-12-31`;
    }
    
    const { startDate, endDate } = getRangeBounds(days, endDateKey);

    const user = await getUserOrThrow(userId);
    const activities = await UserActivity.find({
        userId,
        date: { $gte: startDate, $lte: endDate },
    })
        .select("date active studyMinutes problemsSolved sessionsCount consistencyScore")
        .sort({ date: 1 })
        .lean();

    const weekly = formatConsistencyWindow({ activities, days: Math.min(7, days), endDateKey: endDate });
    const monthly = formatConsistencyWindow({ activities, days: Math.min(30, days), endDateKey: endDate });
    const selected = formatConsistencyWindow({ activities, days, endDateKey: endDate });

    return res.status(200).json({
        success: true,
        consistencyPercentage: user.stats?.consistencyPercentage || selected.consistencyPercentage,
        activeDays: selected.activeDays,
        totalDays: selected.totalDays,
        weekly,
        monthly,
        heatmap: selected.days,
    });
});

export const getStreakData = asyncHandler(async (req, res) => {
    const userId = req.params.userId || req.user?.id;
    const user = await getUserOrThrow(userId);

    return res.status(200).json({
        success: true,
        currentStreak: user.stats?.currentStreak || 0,
        maxStreak: user.stats?.maxStreak || 0,
        lastActiveDate: user.stats?.lastActiveDate || null,
        totalActiveDays: user.stats?.totalActiveDays || 0,
    });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.params.userId || req.user?.id;
    const user = await User.findById(userId)
        .select("stats badges xp level")
        .populate({
            path: "badges.badgeId",
            select: "name slug description image category rarity xpReward",
        })
        .lean();

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const { startDate, endDate } = getRangeBounds(7);
    const recentActivities = await UserActivity.find({
        userId,
        date: { $gte: startDate, $lte: endDate },
    })
        .select("date active studyMinutes problemsSolved sessionsCount consistencyScore")
        .sort({ date: 1 })
        .lean();

    const weeklyConsistency = formatConsistencyWindow({
        activities: recentActivities,
        days: 7,
        endDateKey: endDate,
    });

    return res.status(200).json({
        success: true,
        stats: {
            ...user.stats,
            xp: user.xp || 0,
            level: user.level || 1,
            badgesCount: user.badges?.length || 0,
        },
        badges: user.badges || [],
        weeklyConsistency,
        recentActivities,
    });
});
