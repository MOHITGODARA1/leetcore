import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middleware/auth.middleware.js";
import SolvedProblem from "../models/SolvedProblem.models.js";
import User from "../models/User.models.js";
import UserActivity from "../models/useractivity.models.js";
import Badge from "../models/Badge.models.js";
import { toDateKey, getRangeBounds, getYesterdayKey } from "../utils/date.utils.js";
import { calculateDailyConsistencyScore, getNextStreak, calculateLevel } from "../utils/gamification.utils.js";

const router = express.Router();

const progressRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to normalize topic name to match files
function normalizeTopicName(topic) {
    if (!topic) return "";
    return topic.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Helper to normalize pattern slug
function normalizePatternSlug(pattern) {
    if (!pattern) return "";
    return pattern.toLowerCase()
        .replace(/’/g, "")
        .replace(/'/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// Optional Auth Middleware to grab user ID if logged in
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token || (req.get("authorization")?.startsWith("Bearer ") ? req.get("authorization").slice(7).trim() : "");
        if (token && process.env.JWT_SECRET) {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedToken;
        }
    } catch (error) {
        // Silent catch for guest users
    }
    next();
};

const recommendationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." },
});

const patternMetadata = {
    "two-pointers": {
        title: "Two Pointers",
        desc: "Use two indices moving toward each other or in the same direction."
    },
    "sliding-window": {
        title: "Sliding Window",
        desc: "Maintain a dynamic subarray."
    },
    "prefix-sum": {
        title: "Prefix Sum",
        desc: "Precompute cumulative sums."
    },
    "binary-search": {
        title: "Binary Search",
        desc: "Divide search space in half."
    },
    "matrix": {
        title: "Matrix",
        desc: "Navigate 2D arrays."
    },
    "sorting": {
        title: "Sorting",
        desc: "Sort first, then solve Problems."
    },
    "kadanes-algorithm": {
        title: "Kadane’s Algorithm",
        desc: "Maximum/minimum subarray optimization."
    },
    "hashing": {
        title: "Hashing",
        desc: "Use HashMap or HashSet."
    },
    "monotonic-stack": {
        title: "Monotonic Stack",
        desc: "Maintain increasing/decreasing order."
    }
};

// Helper to check topic completion on server
async function isTopicComplete(userId, topicName) {
    const normTopic = topicName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const jsonPath = path.join(__dirname, "..", "data", "questions", `${normTopic}question.json`);
    if (!fs.existsSync(jsonPath)) return false;
    try {
        const totalCount = JSON.parse(fs.readFileSync(jsonPath, "utf-8")).length;
        const solvedCount = await SolvedProblem.countDocuments({ userId, topic: normTopic });
        return totalCount > 0 && solvedCount >= totalCount;
    } catch (err) {
        return false;
    }
}

// 19 Predefined badges to check and award
const SERVER_BADGE_DEFINITIONS = [
    {
        name: "The Initiator",
        slug: "initiator",
        description: "Solve 20 tracked problems.",
        category: "study",
        rarity: "common",
        xpReward: 100,
        check: async (userId, stats) => stats.solved >= 20
    },
    {
        name: "Problem Solver",
        slug: "problem-solver",
        description: "Solve 50 tracked problems.",
        category: "study",
        rarity: "common",
        xpReward: 200,
        check: async (userId, stats) => stats.solved >= 50
    },
    {
        name: "DSA Explorer",
        slug: "dsa-explorer",
        description: "Solve 100 tracked problems.",
        category: "study",
        rarity: "rare",
        xpReward: 400,
        check: async (userId, stats) => stats.solved >= 100
    },
    {
        name: "Algorithm Addict",
        slug: "algo-addict",
        description: "Solve 250 tracked problems.",
        category: "study",
        rarity: "rare",
        xpReward: 600,
        check: async (userId, stats) => stats.solved >= 250
    },
    {
        name: "Core Master",
        slug: "core-master",
        description: "Solve 500 tracked problems.",
        category: "study",
        rarity: "epic",
        xpReward: 1000,
        check: async (userId, stats) => stats.solved >= 500
    },
    {
        name: "LeetCore Legend",
        slug: "leetcore-legend",
        description: "Solve 1000 tracked problems.",
        category: "study",
        rarity: "legendary",
        xpReward: 2000,
        check: async (userId, stats) => stats.solved >= 1000
    },
    {
        name: "Week Warrior",
        slug: "week-warrior",
        description: "Maintain a 7-day learning streak.",
        category: "streak",
        rarity: "rare",
        xpReward: 250,
        check: async (userId, stats) => stats.streak >= 7
    },
    {
        name: "Consistency Champion",
        slug: "consistency-champion",
        description: "Maintain a 14-day learning streak.",
        category: "streak",
        rarity: "rare",
        xpReward: 500,
        check: async (userId, stats) => stats.streak >= 14
    },
    {
        name: "Unbreakable",
        slug: "unbreakable",
        description: "Maintain a 30-day learning streak.",
        category: "streak",
        rarity: "epic",
        xpReward: 1000,
        check: async (userId, stats) => stats.streak >= 30
    },
    {
        name: "Iron Discipline",
        slug: "iron-discipline",
        description: "Maintain a 60-day learning streak.",
        category: "streak",
        rarity: "epic",
        xpReward: 1800,
        check: async (userId, stats) => stats.streak >= 60
    },
    {
        name: "Annual Warrior",
        slug: "annual-warrior",
        description: "Maintain a 365-day learning streak.",
        category: "streak",
        rarity: "legendary",
        xpReward: 5000,
        check: async (userId, stats) => stats.streak >= 365
    },
    {
        name: "Array Master",
        slug: "array-master",
        description: "Master all questions in the Arrays topic.",
        category: "problem-solving",
        rarity: "rare",
        xpReward: 500,
        check: async (userId, stats) => isTopicComplete(userId, "Array")
    },
    {
        name: "String Specialist",
        slug: "string-specialist",
        description: "Master all questions in the Strings topic.",
        category: "problem-solving",
        rarity: "rare",
        xpReward: 500,
        check: async (userId, stats) => isTopicComplete(userId, "String")
    },
    {
        name: "Linked List Expert",
        slug: "linked-list-expert",
        description: "Master all questions in the Linked List topic.",
        category: "problem-solving",
        rarity: "rare",
        xpReward: 500,
        check: async (userId, stats) => isTopicComplete(userId, "Linked List")
    },
    {
        name: "Stack Sensei",
        slug: "stack-sensei",
        description: "Master all questions in the Stack topic.",
        category: "problem-solving",
        rarity: "rare",
        xpReward: 500,
        check: async (userId, stats) => isTopicComplete(userId, "Stack")
    },
    {
        name: "Queue Commander",
        slug: "queue-commander",
        description: "Master all questions in the Queue topic.",
        category: "problem-solving",
        rarity: "rare",
        xpReward: 500,
        check: async (userId, stats) => isTopicComplete(userId, "Queue")
    },
    {
        name: "Tree Explorer",
        slug: "tree-explorer",
        description: "Master all questions in the Trees topic.",
        category: "problem-solving",
        rarity: "rare",
        xpReward: 500,
        check: async (userId, stats) => isTopicComplete(userId, "Trees")
    },
    {
        name: "Graph Navigator",
        slug: "graph-navigator",
        description: "Master all questions in the Graphs topic.",
        category: "problem-solving",
        rarity: "epic",
        xpReward: 800,
        check: async (userId, stats) => isTopicComplete(userId, "Graphs")
    },
    {
        name: "DP Architect",
        slug: "dp-architect",
        description: "Master all questions in the Dynamic Programming topic.",
        category: "problem-solving",
        rarity: "epic",
        xpReward: 1000,
        check: async (userId, stats) => isTopicComplete(userId, "Dynamic Programming")
    }
];

// Helper function to check and award badges to the user
async function checkAndAwardBadges(user, topic, pattern) {
    const userId = user._id;
    const solved = user.stats?.totalProblemsSolved || 0;
    const streak = Math.max(user.stats?.maxStreak || 0, user.stats?.currentStreak || 0);
    const stats = { solved, streak };

    for (const badgeDef of SERVER_BADGE_DEFINITIONS) {
        try {
            const qualifies = await badgeDef.check(userId, stats);
            if (qualifies) {
                let badge = await Badge.findOne({ slug: badgeDef.slug });
                if (!badge) {
                    badge = await Badge.create({
                        name: badgeDef.name,
                        slug: badgeDef.slug,
                        description: badgeDef.description,
                        category: badgeDef.category,
                        rarity: badgeDef.rarity,
                        xpReward: badgeDef.xpReward,
                        image: `/badges/${badgeDef.slug}.png`
                    });
                }

                // Award to user if not already earned
                const alreadyEarned = user.badges.some(b => b.badgeId.toString() === badge._id.toString());
                if (!alreadyEarned) {
                    user.badges.push({ badgeId: badge._id, earnedAt: new Date() });
                    user.xp += badge.xpReward || 0;
                    console.log(`Awarded badge "${badge.name}" to ${user.username}`);
                }
            }
        } catch (err) {
            console.error(`Error checking/awarding badge ${badgeDef.slug}:`, err);
        }
    }
}

// Route to get list of patterns and counts for a topic
router.get("/patterns", optionalAuth, async (req, res) => {
    try {
        const { topic } = req.query;
        if (!topic) {
            return res.status(400).json({ success: false, message: "topic is required" });
        }

        const normalizedTopic = normalizeTopicName(topic);
        const jsonPath = path.join(__dirname, "..", "data", "questions", `${normalizedTopic}question.json`);

        if (!fs.existsSync(jsonPath)) {
            return res.status(404).json({ success: false, message: `No questions found for topic ${topic}` });
        }

        const rawData = fs.readFileSync(jsonPath, "utf-8");
        const questions = JSON.parse(rawData);

        // Fetch user solved problems for this topic if logged in
        let solvedMap = new Set();
        if (req.user?.id) {
            const solvedList = await SolvedProblem.find({ userId: req.user.id, topic: normalizedTopic });
            solvedMap = new Set(solvedList.map(p => p.problemId));
        }

        // Count totals and solved by pattern
        const counts = {};
        questions.forEach(q => {
            const patSlug = normalizePatternSlug(q.pattern);
            if (!counts[patSlug]) {
                counts[patSlug] = { total: 0, solvedCount: 0 };
            }
            counts[patSlug].total += 1;
            if (solvedMap.has(q._id)) {
                counts[patSlug].solvedCount += 1;
            }
        });

        // Map counts to the metadata registry or construct dynamically
        const responseData = Object.keys(counts).map(slug => {
            const meta = patternMetadata[slug] || { title: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "), desc: `Problems related to ${slug}.` };
            return {
                title: meta.title,
                slug: slug,
                desc: meta.desc,
                total: counts[slug].total,
                solvedCount: counts[slug].solvedCount
            };
        });

        return res.status(200).json({
            success: true,
            patterns: responseData
        });

    } catch (error) {
        console.error("Error in get patterns:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Route to get topic progress for profile dashboard
router.get("/progress", progressRateLimiter, optionalAuth, async (req, res) => {
    try {
        const userId = req.user?.id;

        // Perform active daily streak reset check if user is logged in
        if (userId) {
            const user = await User.findById(userId);
            if (user && user.stats) {
                const today = toDateKey();
                const yesterday = getYesterdayKey(today);
                if (user.stats.lastActiveDate && user.stats.lastActiveDate !== today && user.stats.lastActiveDate !== yesterday) {
                    user.stats.currentStreak = 0;
                    await user.save();
                }
            }
        }

        const topics = [
            { name: "Arrays", topic: "Array" },
            { name: "Strings", topic: "String" },
            { name: "Hashing", topic: "Hashing" },
            { name: "Binary Search", topic: "Binary Search" },
            { name: "Linked List", topic: "Linked List" },
            { name: "Stack", topic: "Stack" },
            { name: "Queue", topic: "Queue" },
            { name: "Recursion", topic: "Recursion" },
            { name: "Backtracking", topic: "Backtracking" },
            { name: "Trees", topic: "Trees" },
            { name: "Binary Search Tree", topic: "Binary Search Tree" },
            { name: "Heap / PQ", topic: "Heap / Priority Queue" },
            { name: "Graphs", topic: "Graphs" },
            { name: "Trie", topic: "Trie" },
            { name: "Greedy", topic: "Greedy" },
            { name: "Dynamic Programming", topic: "Dynamic Programming" },
            { name: "Bit Manipulation", topic: "Bit Manipulation" }
        ];

        const results = [];
        let totalQuestionsAll = 0;
        let totalSolvedAll = 0;

        for (const t of topics) {
            const normTopic = normalizeTopicName(t.topic);
            const jsonPath = path.join(__dirname, "..", "data", "questions", `${normTopic}question.json`);
            let total = 180; // default fallback
            if (fs.existsSync(jsonPath)) {
                total = JSON.parse(fs.readFileSync(jsonPath, "utf-8")).length;
            }
            totalQuestionsAll += total;

            let solved = 0;
            if (userId) {
                solved = await SolvedProblem.countDocuments({ userId, topic: normTopic });
            }
            totalSolvedAll += solved;

            results.push({
                name: t.name,
                topic: t.topic,
                solved,
                total
            });
        }

        return res.status(200).json({
            success: true,
            topics: results,
            totalQuestions: totalQuestionsAll,
            totalSolved: totalSolvedAll
        });
    } catch (err) {
        console.error("Error in progress:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Route to get questions for a topic and pattern
router.get("/", optionalAuth, async (req, res) => {
    try {
        const { topic, pattern } = req.query;
        if (!topic || !pattern) {
            return res.status(400).json({ success: false, message: "topic and pattern query parameters are required" });
        }

        const normalizedTopic = normalizeTopicName(topic);
        const normalizedPattern = normalizePatternSlug(pattern);
        const baseQuestionsDir = path.resolve(__dirname, "..", "data", "questions");
        const jsonPath = path.resolve(baseQuestionsDir, `${normalizedTopic}question.json`);

        if (jsonPath !== baseQuestionsDir && !jsonPath.startsWith(baseQuestionsDir + path.sep)) {
            return res.status(403).json({ success: false, message: "Invalid topic path" });
        }

        if (!fs.existsSync(jsonPath)) {
            return res.status(200).json({ success: true, questions: [] });
        }

        const rawData = fs.readFileSync(jsonPath, "utf-8");
        const questions = JSON.parse(rawData);

        // Filter questions by pattern
        const filteredQuestions = questions.filter(q => normalizePatternSlug(q.pattern) === normalizedPattern);

        // Annotate questions with solved status
        let solvedSet = new Set();
        if (req.user?.id) {
            const solvedList = await SolvedProblem.find({
                userId: req.user.id,
                topic: normalizedTopic,
                pattern: normalizedPattern
            });
            solvedSet = new Set(solvedList.map(p => p.problemId));
        }

        const annotatedQuestions = filteredQuestions.map(q => ({
            ...q,
            solved: solvedSet.has(q._id)
        }));

        return res.status(200).json({
            success: true,
            questions: annotatedQuestions
        });

    } catch (error) {
        console.error("Error in get questions:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Route to toggle solved status of a problem
router.post("/toggle-solve", authMiddleware, async (req, res) => {
    try {
        const { problemId, topic, pattern } = req.body;
        const userId = req.user.id;

        if (!problemId || !topic || !pattern) {
            return res.status(400).json({ success: false, message: "problemId, topic, and pattern are required" });
        }

        const normalizedTopic = normalizeTopicName(topic);
        const normalizedPattern = normalizePatternSlug(pattern);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const existingSolved = await SolvedProblem.findOne({ userId, problemId });
        const solved = !existingSolved; // toggle status

        if (existingSolved) {
            // Unsolve: remove solved problem document
            await SolvedProblem.deleteOne({ _id: existingSolved._id });
        } else {
            // Solve: create solved problem document
            await SolvedProblem.create({
                userId,
                problemId,
                topic: normalizedTopic,
                pattern: normalizedPattern
            });
        }

        // --- Gamification & Streak updates ---
        const date = toDateKey();
        const existingActivity = await UserActivity.findOne({ userId, date });
        const wasNewActiveDay = !existingActivity;

        const deltaSolved = solved ? 1 : -1;
        const nextProblemsSolved = Math.max((existingActivity?.problemsSolved || 0) + deltaSolved, 0);
        const nextStudyMinutes = existingActivity?.studyMinutes || 0;
        const nextSessionsCount = existingActivity?.sessionsCount || 0;

        const consistencyScore = calculateDailyConsistencyScore({
            studyMinutes: nextStudyMinutes,
            problemsSolved: nextProblemsSolved,
            sessionsCount: nextSessionsCount
        });

        const xpDelta = solved ? 15 : -15;

        const nextStreak = wasNewActiveDay
            ? getNextStreak(user.stats?.lastActiveDate, user.stats?.currentStreak, date)
            : user.stats?.currentStreak || existingActivity?.streakCount || 0;

        let activity;
        try {
            activity = await UserActivity.findOneAndUpdate(
                { userId, date },
                {
                    $set: {
                        active: true,
                        problemsSolved: nextProblemsSolved,
                        streakCount: nextStreak,
                        consistencyScore,
                        completionRate: consistencyScore
                    },
                    $inc: {
                        xpEarned: xpDelta
                    }
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true
                }
            );
        } catch (updateError) {
            if (updateError.code === 11000) {
                // Gracefully handle compound index duplicate key error on concurrent upsert operations
                activity = await UserActivity.findOneAndUpdate(
                    { userId, date },
                    {
                        $set: {
                            active: true,
                            problemsSolved: nextProblemsSolved,
                            streakCount: nextStreak,
                            consistencyScore,
                            completionRate: consistencyScore
                        },
                        $inc: {
                            xpEarned: xpDelta
                        }
                    },
                    {
                        new: true
                    }
                );
            } else {
                throw updateError;
            }
        }

        if (wasNewActiveDay) {
            user.stats.totalActiveDays += 1;
            user.stats.currentStreak = nextStreak;
            user.stats.maxStreak = Math.max(user.stats.maxStreak || 0, nextStreak);
            user.stats.lastActiveDate = date;
        }

        const actualSolvedCount = await SolvedProblem.countDocuments({ userId });
        user.stats.totalProblemsSolved = actualSolvedCount;
        user.xp = Math.max((user.xp || 0) + xpDelta, 0);

        // Call checkAndAwardBadges to award topic-completion or streak badges
        if (solved) {
            await checkAndAwardBadges(user, topic, pattern);
        }

        // Recalculate user level using the problemsSolved formula
        user.level = calculateLevel(user.xp, user.stats.totalProblemsSolved);

        // Recalculate 30-day consistency window
        const { startDate, endDate } = getRangeBounds(30, date);
        const activeDaysInWindow = await UserActivity.countDocuments({
            userId,
            active: true,
            date: { $gte: startDate, $lte: endDate }
        });
        user.stats.consistencyPercentage = Math.round((activeDaysInWindow / 30) * 100);

        await user.save();
        await user.populate("badges.badgeId");

        return res.status(200).json({
            success: true,
            solved,
            stats: user.stats,
            xp: user.xp,
            level: user.level,
            badges: user.badges
        });

    } catch (error) {
        console.error("Error in toggle solve:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

const recentSolvedLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." }
});

// Route to get recently solved problems
router.get("/recent-solved", recentSolvedLimiter, optionalAuth, async (req, res) => {
    try {
        const userId = req.user?.id || req.query.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not logged in" });
        }
        if (typeof userId !== "string") {
            return res.status(400).json({ success: false, message: "Invalid userId" });
        }

        const all = req.query.all === "true";
        let query = SolvedProblem.find({ userId }).sort({ solvedAt: -1 });
        if (!all) {
            query = query.limit(10);
        }
        const solvedList = await query.lean();

        const loadedQuestionsCache = {};
        const getQuestionDetails = (topic, problemId) => {
            const normTopic = normalizeTopicName(topic);
            if (!normTopic) return null;
            
            if (!loadedQuestionsCache[normTopic]) {
                const jsonPath = path.join(__dirname, "..", "data", "questions", `${normTopic}question.json`);
                if (fs.existsSync(jsonPath)) {
                    try {
                        loadedQuestionsCache[normTopic] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
                    } catch (err) {
                        console.error(`Error reading questions file for ${normTopic}:`, err);
                        loadedQuestionsCache[normTopic] = [];
                    }
                } else {
                    loadedQuestionsCache[normTopic] = [];
                }
            }
            return loadedQuestionsCache[normTopic].find(q => q._id === problemId);
        };

        const recentSolved = solvedList.map(item => {
            const qDetails = getQuestionDetails(item.topic, item.problemId);
            return {
                problemId: item.problemId,
                title: qDetails?.title || "Unknown Problem",
                topic: item.topic,
                pattern: item.pattern,
                difficulty: qDetails?.difficulty || "Medium",
                leetcodeUrl: qDetails?.leetcodeUrl || "#",
                problemNumber: qDetails?.problemNumber,
                solvedAt: item.solvedAt || item.createdAt
            };
        });

        return res.status(200).json({
            success: true,
            recentSolved
        });
    } catch (error) {
        console.error("Error in get recent-solved:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Route to get next recommended question
router.get("/recommendation", recommendationLimiter, optionalAuth, async (req, res) => {
    try {
        const userId = req.user?.id ?? req.query.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not logged in" });
        }
        if (typeof userId !== "string") {
            return res.status(400).json({ success: false, message: "Invalid userId" });
        }

        const lastSolved = await SolvedProblem.findOne({ userId: { $eq: userId } })
            .sort({ solvedAt: -1, createdAt: -1 })
            .lean();

        const topicsOrder = [
            "array",
            "string",
            "hashing",
            "binarysearch",
            "linkedlist",
            "stack",
            "queue",
            "recursion",
            "backtracking",
            "trees",
            "binarysearchtree",
            "heappriorityqueue",
            "graphs",
            "trie",
            "greedy",
            "dynamicprogramming",
            "bitmanipulation"
        ];

        const loadQuestions = (topic) => {
            const normTopic = normalizeTopicName(topic);
            const jsonPath = path.join(__dirname, "..", "data", "questions", `${normTopic}question.json`);
            if (fs.existsSync(jsonPath)) {
                try {
                    return JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
                } catch (err) {
                    console.error(`Error reading ${normTopic} question file:`, err);
                    return [];
                }
            }
            return [];
        };

        let recommendedQuestion = null;

        if (!lastSolved) {
            // Recommendation fallback: first question of the first topic
            const firstTopicQuestions = loadQuestions(topicsOrder[0]);
            if (firstTopicQuestions.length > 0) {
                recommendedQuestion = {
                    ...firstTopicQuestions[0],
                    topic: topicsOrder[0],
                };
            }
        } else {
            // Load questions of current topic
            const currentTopicQuestions = loadQuestions(lastSolved.topic);
            const lastSolvedIdx = currentTopicQuestions.findIndex(q => q._id === lastSolved.problemId);

            if (lastSolvedIdx !== -1 && lastSolvedIdx < currentTopicQuestions.length - 1) {
                // If it is not the last question, recommend the next question in the topic
                recommendedQuestion = {
                    ...currentTopicQuestions[lastSolvedIdx + 1],
                    topic: lastSolved.topic
                };
            } else {
                // If it IS the last question of the topic, search for the next unsolved question in subsequent topics
                const currentTopicIdx = topicsOrder.indexOf(lastSolved.topic);
                let found = false;

                for (let i = currentTopicIdx + 1; i < topicsOrder.length; i++) {
                    const nextTopic = topicsOrder[i];
                    const nextQuestions = loadQuestions(nextTopic);
                    
                    // Fetch solved problem IDs for this user in this topic
                    const solvedList = await SolvedProblem.find({ userId, topic: nextTopic }).select("problemId").lean();
                    const solvedSet = new Set(solvedList.map(p => p.problemId));

                    const unsolved = nextQuestions.find(q => !solvedSet.has(q._id));
                    if (unsolved) {
                        recommendedQuestion = {
                            ...unsolved,
                            topic: nextTopic
                        };
                        found = true;
                        break;
                    }
                }

                // If not found in subsequent topics, loop back from the beginning of all topics to find any unsolved question
                if (!found) {
                    for (let i = 0; i <= currentTopicIdx; i++) {
                        const nextTopic = topicsOrder[i];
                        const nextQuestions = loadQuestions(nextTopic);
                        const solvedList = await SolvedProblem.find({ userId: { $eq: userId }, topic: nextTopic }).select("problemId").lean();
                        const solvedSet = new Set(solvedList.map(p => p.problemId));

                        const unsolved = nextQuestions.find(q => !solvedSet.has(q._id));
                        if (unsolved) {
                            recommendedQuestion = {
                                ...unsolved,
                                topic: nextTopic
                            };
                            found = true;
                            break;
                        }
                    }
                }

                // Ultimate fallback: if everything is solved, recommend the very first question of the first topic
                if (!found) {
                    const firstTopicQuestions = loadQuestions(topicsOrder[0]);
                    if (firstTopicQuestions.length > 0) {
                        recommendedQuestion = {
                            ...firstTopicQuestions[0],
                            topic: topicsOrder[0],
                        };
                    }
                }
            }
        }

        return res.status(200).json({
            success: true,
            recommendedQuestion
        });

    } catch (error) {
        console.error("Error in get recommendation:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

export default router;
