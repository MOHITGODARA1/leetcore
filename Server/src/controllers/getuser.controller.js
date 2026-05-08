import User from "../models/User.models.js";

const getCurrentUser = async (req, res) => {

    try {

        const user = await User.findById(req.user?.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

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