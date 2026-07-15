import mongoose from 'mongoose';
import User from '../src/models/User.models.js';
import SolvedProblem from '../src/models/SolvedProblem.models.js';
import UserActivity from '../src/models/useractivity.models.js';
import Badge from '../src/models/Badge.models.js';
import { calculateDailyConsistencyScore, getNextStreak, calculateLevel } from '../src/utils/gamification.utils.js';
import { toDateKey, getRangeBounds } from '../src/utils/date.utils.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRACTICE_LIMIT = 25;

async function isTopicComplete(userId, topicName) {
    const normTopic = topicName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const jsonPath = path.join(__dirname, '..', 'src', 'data', 'questions', `${normTopic}question.json`);
    if (!fs.existsSync(jsonPath)) return false;
    try {
        const questions = JSON.parse(fs.readFileSync(jsonPath, "utf-8")).slice(0, PRACTICE_LIMIT);
        const questionIds = questions.map(q => q._id).filter(Boolean);
        const totalCount = questionIds.length;
        if (totalCount === 0) return false;

        const solvedCount = await SolvedProblem.countDocuments({
            userId,
            topic: normTopic,
            problemId: { $in: questionIds }
        });
        return solvedCount >= totalCount;
    } catch (err) {
        return false;
    }
}

const SERVER_BADGE_DEFINITIONS = [
    {
        name: "Array Master",
        slug: "array-master",
        description: "Master all questions in the Arrays topic.",
        category: "problem-solving",
        rarity: "rare",
        xpReward: 500,
        check: async (userId, stats) => isTopicComplete(userId, "Array")
    }
];

async function checkAndAwardBadges(user, topic, pattern) {
    const userId = user._id;
    const solved = user.stats?.totalProblemsSolved || 0;
    const streak = Math.max(user.stats?.maxStreak || 0, user.stats?.currentStreak || 0);
    const stats = { solved, streak };

    for (const badgeDef of SERVER_BADGE_DEFINITIONS) {
        try {
            if (badgeDef.category === "problem-solving") {
                const normTopic = topic.toLowerCase().replace(/[^a-z0-9]/g, "");
                let isMatch = false;
                if (normTopic === "array" && badgeDef.slug === "array-master") isMatch = true;
                if (!isMatch) continue;
            }

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

async function testToggle() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to DB");

        // Find test user
        let user = await User.findOne({ username: "test_new_user" });
        if (!user) {
            user = await User.create({
                githubId: "test_new_123456",
                username: "test_new_user",
                avatar: "https://example.com/avatar.png",
                email: "test_new_user@example.com"
            });
        }
        console.log("User stats before:", user.stats);

        const problemId = "arr_tp_001";
        const topic = "Array";
        const pattern = "hash-map";
        const userId = user._id;

        const normalizedTopic = topic.toLowerCase().replace(/[^a-z0-9]/g, "");
        const normalizedPattern = pattern.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        const existingSolved = await SolvedProblem.findOne({ userId, problemId });
        const solved = !existingSolved;

        if (existingSolved) {
            await SolvedProblem.deleteOne({ _id: existingSolved._id });
            console.log("Unsolved problem");
        } else {
            await SolvedProblem.create({
                userId,
                problemId,
                topic: normalizedTopic,
                pattern: normalizedPattern
            });
            console.log("Solved problem");
        }

        const date = toDateKey();
        const existingActivity = await UserActivity.findOne({ userId: new mongoose.Types.ObjectId(userId), date });
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

        let activity = await UserActivity.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId), date },
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
                returnDocument: 'after',
                upsert: true,
                setDefaultsOnInsert: true
            }
        );
        console.log("Activity updated:", activity);

        if (wasNewActiveDay) {
            user.stats.totalActiveDays += 1;
            user.stats.currentStreak = nextStreak;
            user.stats.maxStreak = Math.max(user.stats.maxStreak || 0, nextStreak);
            user.stats.lastActiveDate = date;
        }

        const actualSolvedCount = await SolvedProblem.countDocuments({ userId });
        user.stats.totalProblemsSolved = actualSolvedCount;
        user.xp = Math.max((user.xp || 0) + xpDelta, 0);

        if (solved) {
            await checkAndAwardBadges(user, topic, pattern);
        }

        user.level = calculateLevel(user.xp, user.stats.totalProblemsSolved);

        const { startDate, endDate } = getRangeBounds(30, date);
        const activeDaysInWindow = await UserActivity.countDocuments({
            userId,
            active: true,
            date: { $gte: startDate, $lte: endDate }
        });
        user.stats.consistencyPercentage = Math.round((activeDaysInWindow / 30) * 100);

        await user.save();
        console.log("User updated successfully! Stats:", user.stats);
    } catch (err) {
        console.error("Test failed with error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

testToggle();
