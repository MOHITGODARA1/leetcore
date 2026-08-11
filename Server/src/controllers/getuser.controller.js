import User from "../models/User.models.js";

export const serializeUser = (user) => ({
    username: user.username,
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,
    profileUrl: user.profileUrl,
    publicProfileEnabled: user.publicProfileEnabled,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
});

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user?.id)
            .select("username name avatar bio profileUrl publicProfileEnabled createdAt lastLogin")
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user: serializeUser(user),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export default getCurrentUser;
