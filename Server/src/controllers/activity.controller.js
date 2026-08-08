import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import UserActivity from "../models/UserActivity.models.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const questionsPath = path.resolve(__dirname, "../data/questions.json");
const topicsPath = path.resolve(__dirname, "../data/topics.json");
const questionsData = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
const topicsData = JSON.parse(fs.readFileSync(topicsPath, "utf8"));
const topics = topicsData.topics || [];

const toDateKey = (date = new Date()) => date.toISOString().slice(0, 10);

const addDays = (date, days) => {
    const nextDate = new Date(date);
    nextDate.setUTCDate(nextDate.getUTCDate() + days);
    return nextDate;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const findQuestionTopic = (questionId) => {
    for (const [topicId, questions] of Object.entries(questionsData)) {
        const question = questions.find((item) => item.id === questionId);
        if (question) {
            return {
                topicId,
                difficulty: question.difficulty || "Medium",
            };
        }
    }

    return null;
};

const getTopicSummaries = (solvedQuestions = []) => {
    const solvedByTopic = solvedQuestions.reduce((acc, question) => {
        acc[question.topicId] = (acc[question.topicId] || 0) + 1;
        return acc;
    }, {});

    return topics.map((topic) => {
        const total = questionsData[topic.id]?.length || 0;
        const solved = Math.min(solvedByTopic[topic.id] || 0, total);
        const percent = total > 0 ? Math.round((solved / total) * 100) : 0;

        return {
            id: topic.id,
            label: topic.label,
            order: topic.order,
            solved,
            total,
            percent,
        };
    });
};

const getCurrentTopic = (topicSummaries) => {
    const activeTopic = topicSummaries.find((topic) => topic.total > 0 && topic.solved < topic.total);
    return activeTopic || topicSummaries.find((topic) => topic.total > 0) || {
        id: "arrays",
        label: "Arrays",
        solved: 0,
        total: 0,
        percent: 0,
    };
};

const getWeeklyProgress = (dailyActivity = []) => {
    const activityByDate = new Map(dailyActivity.map((day) => [day.date, day]));
    const today = new Date();

    return Array.from({ length: 7 }, (_, index) => {
        const date = addDays(today, index - 6);
        const dateKey = toDateKey(date);
        const day = activityByDate.get(dateKey);

        return {
            date: dateKey,
            label: date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
            solvedCount: day?.solvedCount || 0,
            submissions: day?.submissions || 0,
        };
    });
};

const getStreakCount = (dailyActivity = []) => {
    const solvedDates = new Set(
        dailyActivity
            .filter((day) => day.solvedCount > 0)
            .map((day) => day.date)
    );

    let cursor = new Date();
    if (!solvedDates.has(toDateKey(cursor))) {
        cursor = addDays(cursor, -1);
    }

    let streak = 0;
    while (solvedDates.has(toDateKey(cursor))) {
        streak += 1;
        cursor = addDays(cursor, -1);
    }

    return streak;
};

const getContestRank = async (activity) => {
    const solvedCount = activity.solvedQuestions.length;
    const betterUsers = await UserActivity.countDocuments({
        $expr: {
            $gt: [{ $size: "$solvedQuestions" }, solvedCount],
        },
    });
    const totalUsers = await UserActivity.countDocuments();
    const rank = totalUsers > 0 ? betterUsers + 1 : 1;
    const percentile = totalUsers > 1
        ? Math.round(((totalUsers - rank) / (totalUsers - 1)) * 100)
        : 100;

    return {
        rank,
        totalUsers: Math.max(totalUsers, 1),
        percentile,
    };
};

const buildSummary = async (activity) => {
    const topicProgress = getTopicSummaries(activity.solvedQuestions);
    const currentTopic = getCurrentTopic(topicProgress);
    const weeklyProgress = getWeeklyProgress(activity.dailyActivity);
    const weeklySolved = weeklyProgress.reduce((total, day) => total + day.solvedCount, 0);
    const streakCount = getStreakCount(activity.dailyActivity);
    const solvedCount = activity.solvedQuestions.length;
    const totalQuestions = Object.values(questionsData).reduce((total, questions) => total + questions.length, 0);
    const readinessScore = clamp(Math.round((streakCount * 8) + (weeklySolved * 6) + (solvedCount * 2)), 0, 100);
    const contestRank = await getContestRank(activity);

    return {
        solvedCount,
        totalQuestions,
        streakCount,
        readinessScore,
        weeklySolved,
        currentTopic,
        topicProgress,
        weeklyProgress,
        contestRank,
        lastActivityAt: activity.lastActivityAt,
    };
};

const getOrCreateActivity = async (userId) => {
    let activity = await UserActivity.findOne({ user: userId });

    if (!activity) {
        activity = await UserActivity.create({ user: userId });
    }

    return activity;
};

export const getActivitySummary = async (req, res) => {
    try {
        const activity = await getOrCreateActivity(req.user.id);
        const summary = await buildSummary(activity);

        return res.status(200).json({
            success: true,
            summary,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to load activity summary",
        });
    }
};

export const recordAcceptedSubmission = async (req, res) => {
    try {
        const {
            questionId,
            topicId,
            difficulty,
            language,
            runtimeMs,
            memoryKb,
        } = req.body;

        if (!questionId) {
            return res.status(400).json({
                success: false,
                message: "questionId is required",
            });
        }

        const questionMeta = findQuestionTopic(questionId);
        if (!questionMeta) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        const activity = await getOrCreateActivity(req.user.id);
        const resolvedTopicId = topicId || questionMeta.topicId;
        const todayKey = toDateKey();
        const existingQuestion = activity.solvedQuestions.find((question) => question.questionId === questionId);

        if (existingQuestion) {
            existingQuestion.attempts += 1;
            existingQuestion.language = language || existingQuestion.language;
            existingQuestion.lastSolvedAt = new Date();
            existingQuestion.bestRuntimeMs = runtimeMs == null
                ? existingQuestion.bestRuntimeMs
                : Math.min(existingQuestion.bestRuntimeMs ?? runtimeMs, runtimeMs);
            existingQuestion.bestMemoryKb = memoryKb == null
                ? existingQuestion.bestMemoryKb
                : Math.min(existingQuestion.bestMemoryKb ?? memoryKb, memoryKb);
        } else {
            activity.solvedQuestions.push({
                questionId,
                topicId: resolvedTopicId,
                difficulty: difficulty || questionMeta.difficulty,
                language,
                bestRuntimeMs: runtimeMs ?? null,
                bestMemoryKb: memoryKb ?? null,
                firstSolvedAt: new Date(),
                lastSolvedAt: new Date(),
            });
        }

        const day = activity.dailyActivity.find((item) => item.date === todayKey);
        if (day) {
            day.submissions += 1;
            if (!existingQuestion) day.solvedCount += 1;
        } else {
            activity.dailyActivity.push({
                date: todayKey,
                submissions: 1,
                solvedCount: existingQuestion ? 0 : 1,
            });
        }

        activity.totalSubmissions += 1;
        activity.lastActivityAt = new Date();
        await activity.save();

        const summary = await buildSummary(activity);

        return res.status(200).json({
            success: true,
            summary,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to record activity",
        });
    }
};
