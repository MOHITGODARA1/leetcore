import User from "../models/User.models.js";
import axios from "axios";
import jwt from "jsonwebtoken";

const DEFAULT_CLIENT_URL = "http://localhost:5174";

const githubLogin = (req, res) => {

    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        scope: "read:user user:email",
    });

    const redirectURL = `https://github.com/login/oauth/authorize?${params.toString()}`;

    res.redirect(redirectURL);

};
const registerUser = async (req, res) => {

    try {

        // Get code from GitHub
        const code = req.query.code;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "No GitHub code provided",
            });
        }

        // Exchange code for access token
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const accessToken = tokenResponse.data.access_token;

        // Fetch GitHub user
        const githubUser = await axios.get(
            "https://api.github.com/user",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // Fetch email
        const emailResponse = await axios.get(
            "https://api.github.com/user/emails",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const primaryEmail = emailResponse.data.find(
            email => email.primary
        )?.email || "";

        // Extract GitHub data
        const {
            id,
            login,
            avatar_url,
            html_url,
            bio,
            name,
        } = githubUser.data;

        // Find existing user
        let user = await User.findOne({
            githubId: id,
        });

        // Create user if not exists
        if (!user) {

            user = await User.create({
                githubId: id,
                username: login,
                email: primaryEmail,
                avatar: avatar_url,
                profileUrl: html_url,
                bio,
                name,
            });

        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        // Send cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const clientUrl = (process.env.CLIENT_URL || DEFAULT_CLIENT_URL).replace(/\/$/, "");

        return res.redirect(`${clientUrl}/dashboard`);

    } catch (error) {

        console.log("GitHub Auth Error:", error);

        return res.status(500).json({
            success: false,
            message: "Authentication failed",
        });

    }

};


const logoutUser = async (req, res) => {
    try {

        res.clearCookie("token");

        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Logout failed",
        });

    }
}

export { registerUser, githubLogin, logoutUser };
