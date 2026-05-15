import User from "../models/User.models.js";
import axios from "axios";
import jwt from "jsonwebtoken";

const DEFAULT_CLIENT_URL = "http://localhost:5174";

const requiredEnv = (key) => {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
};

const getGithubCallbackUrl = () => (
    process.env.GITHUB_CALLBACK_URL || "http://localhost:4000/api/v1/auth/github/callback"
);

const getPrimaryEmail = (emails = []) => {
    const primaryVerifiedEmail = emails.find(email => email.primary && email.verified)?.email;
    const primaryEmail = emails.find(email => email.primary)?.email;
    const verifiedEmail = emails.find(email => email.verified)?.email;

    return primaryVerifiedEmail || primaryEmail || verifiedEmail || "";
};

const githubLogin = (req, res) => {

    const clientId = requiredEnv("GITHUB_CLIENT_ID");

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: getGithubCallbackUrl(),
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

        const clientId = requiredEnv("GITHUB_CLIENT_ID");
        const clientSecret = requiredEnv("GITHUB_CLIENT_SECRET");
        const jwtSecret = requiredEnv("JWT_SECRET");

        // Exchange code for access token
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: clientId,
                client_secret: clientSecret,
                code,
                redirect_uri: getGithubCallbackUrl(),
            },
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: tokenResponse.data.error_description || "GitHub did not return an access token",
            });
        }

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

        // Extract GitHub data
        const {
            id,
            login,
            avatar_url,
            html_url,
            bio,
            name,
        } = githubUser.data;

        const githubId = String(id);
        const primaryEmail = getPrimaryEmail(emailResponse.data);
        const email = primaryEmail || `${githubId}+${login}@users.noreply.github.com`;

        const userData = {
            githubId,
            username: login,
            email,
            avatar: avatar_url,
            profileUrl: html_url,
            bio: bio || "",
            name: name || login,
            lastLogin: new Date(),
        };

        const existingUserQuery = {
            $or: [
                { githubId },
                { email },
            ],
        };

        // Find existing user
        let user = await User.findOne(existingUserQuery);

        // Create user if not exists
        if (!user) {

            user = await User.create(userData);

        } else {

            user.set(userData);
            await user.save();

        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
            },
            jwtSecret,
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
