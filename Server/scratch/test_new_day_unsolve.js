import mongoose from 'mongoose';
import User from '../src/models/User.models.js';
import SolvedProblem from '../src/models/SolvedProblem.models.js';
import UserActivity from '../src/models/useractivity.models.js';
import { calculateDailyConsistencyScore, getNextStreak } from '../src/utils/gamification.utils.js';
import { toDateKey } from '../src/utils/date.utils.js';
import dotenv from 'dotenv';

dotenv.config();

async function testNewDayUnsolve() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to DB");

        const user = await User.findOne({ username: "test_new_user" });
        const userId = user._id;
        const date = toDateKey();

        // 1. Delete today's activity to simulate new day
        await UserActivity.deleteOne({ userId, date });
        console.log("Deleted today's activity");

        // 2. Simulate unsolving a problem
        const solved = false;
        const deltaSolved = -1;
        const xpDelta = -15;

        const nextProblemsSolved = Math.max(0, deltaSolved); // 0
        const nextStudyMinutes = 0;
        const nextSessionsCount = 0;
        const consistencyScore = calculateDailyConsistencyScore({
            studyMinutes: nextStudyMinutes,
            problemsSolved: nextProblemsSolved,
            sessionsCount: nextSessionsCount
        });
        const nextStreak = getNextStreak(user.stats?.lastActiveDate, user.stats?.currentStreak, date);

        console.log("Attempting findOneAndUpdate (upsert) with negative xpDelta:", xpDelta);
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
        console.log("Activity upserted successfully:", activity);
    } catch (err) {
        console.error("Test failed with error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

testNewDayUnsolve();
