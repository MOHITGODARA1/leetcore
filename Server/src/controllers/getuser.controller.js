import User from "../models/User.models.js";
import SolvedProblem from "../models/SolvedProblem.models.js";
import { calculateLevel } from "../utils/gamification.utils.js";

const getCurrentUser = async (req, res) => {

    try {

        const user = await User.findById(req.user?.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Recalculate actual solved count and level to sync database state
        const actualSolvedCount = await SolvedProblem.countDocuments({ userId: user._id });
        if (user.stats) {
            const calculatedLevel = calculateLevel(user.xp, actualSolvedCount);
            if (user.stats.totalProblemsSolved !== actualSolvedCount || user.level !== calculatedLevel) {
                user.stats.totalProblemsSolved = actualSolvedCount;
                user.level = calculatedLevel;
                await user.save();
            }
        }

        await user.populate("badges.badgeId");

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Server error",
        });

    }

};

export default getCurrentUser;