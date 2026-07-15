import User from "../models/User.models.js";
import { syncUserSolvedCountAndRankings } from "../utils/ranking.utils.js";

const getCurrentUser = async (req, res) => {

    try {

        let user = await User.findById(req.user?.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        await syncUserSolvedCountAndRankings();
        user = await User.findById(req.user?.id);

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
