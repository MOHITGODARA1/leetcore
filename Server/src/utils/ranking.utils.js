import User from "../models/User.models.js";
import SolvedProblem from "../models/SolvedProblem.models.js";
import { calculateLevel } from "./gamification.utils.js";

const BADGE_THRESHOLDS = [1, 5, 10, 25, 50, 100];

export const getPercentileBadge = (percentile) => {
    const normalized = Math.min(Math.max(Math.ceil(Number(percentile) || 100), 1), 100);
    const threshold = BADGE_THRESHOLDS.find((value) => normalized <= value) || 100;
    return `Top ${threshold}%`;
};

const getRankPercentile = ({ rank, totalUsers, totalProblemsSolved }) => {
    if (!totalProblemsSolved) {
        return 100;
    }

    if (rank === 1) {
        return 1;
    }

    return Math.min(100, Math.max(1, Math.ceil((rank / totalUsers) * 100)));
};

const buildSolvedCountMap = async () => {
    const solvedCounts = await SolvedProblem.aggregate([
        {
            $group: {
                _id: "$userId",
                totalProblemsSolved: { $sum: 1 },
            },
        },
    ]);

    return new Map(
        solvedCounts.map((item) => [
            item._id.toString(),
            item.totalProblemsSolved,
        ])
    );
};

export const recalculateProblemRankings = async () => {
    const [users, solvedCountMap] = await Promise.all([
        User.find({})
            .select("_id xp stats.totalProblemsSolved stats.problemRank stats.totalRankedUsers stats.problemRankPercentile stats.percentileBadge level")
            .lean(),
        buildSolvedCountMap(),
    ]);

    const totalUsers = users.length;

    if (totalUsers === 0) {
        return [];
    }

    const rankedUsers = users
        .map((user) => ({
            _id: user._id,
            xp: user.xp || 0,
            level: user.level || 1,
            totalProblemsSolved: solvedCountMap.has(user._id.toString())
                ? solvedCountMap.get(user._id.toString())
                : Number(user.stats?.totalProblemsSolved) || 0,
        }))
        .sort((a, b) => {
            if (b.totalProblemsSolved !== a.totalProblemsSolved) {
                return b.totalProblemsSolved - a.totalProblemsSolved;
            }

            return a._id.toString().localeCompare(b._id.toString());
        });

    const operations = [];
    let previousSolved = null;
    let currentRank = 0;

    rankedUsers.forEach((user, index) => {
        if (previousSolved === null || user.totalProblemsSolved !== previousSolved) {
            currentRank = index + 1;
            previousSolved = user.totalProblemsSolved;
        }

        const percentile = getRankPercentile({
            rank: currentRank,
            totalUsers,
            totalProblemsSolved: user.totalProblemsSolved,
        });

        operations.push({
            updateOne: {
                filter: { _id: user._id },
                update: {
                    $set: {
                        "stats.totalProblemsSolved": user.totalProblemsSolved,
                        "stats.problemRank": currentRank,
                        "stats.totalRankedUsers": totalUsers,
                        "stats.problemRankPercentile": percentile,
                        "stats.percentileBadge": getPercentileBadge(percentile),
                        level: calculateLevel(user.xp, user.totalProblemsSolved),
                    },
                },
            },
        });
    });

    if (operations.length) {
        await User.bulkWrite(operations);
    }

    return rankedUsers.map((user, index) => {
        const rank = operations[index].updateOne.update.$set["stats.problemRank"];
        const percentile = operations[index].updateOne.update.$set["stats.problemRankPercentile"];

        return {
            userId: user._id,
            totalProblemsSolved: user.totalProblemsSolved,
            rank,
            totalRankedUsers: totalUsers,
            percentile,
            percentileBadge: getPercentileBadge(percentile),
        };
    });
};

export const syncUserSolvedCountAndRankings = async () => {
    return recalculateProblemRankings();
};

export const getUserProblemRanking = async (userId) => {
    const rankings = await recalculateProblemRankings();
    return rankings.find((ranking) => ranking.userId.toString() === userId?.toString()) || null;
};
