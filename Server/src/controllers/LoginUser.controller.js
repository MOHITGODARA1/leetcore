import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const GithubLogin = async (req, res) => {
    try {
        const githubURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
        return res.redirect(githubURL);
    } catch (error) {
        console.log("Login Error:", error.message);
    }
};

export const GithubCallback = async (req, res) => {
    const code = req.query.code;

    if (!code) {
        console.log("❌ No code received");
        return res.status(400).send("No code provided");
    }

    try {
        console.log("✅ Code received:", code);

        // STEP 1: Get Access Token
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
            },
            {
                headers: { Accept: "application/json" },
            }
        );

        console.log("Token Response:", tokenResponse.data);

        const token = tokenResponse.data.access_token;

        if (!token) {
            console.log("❌ No token received");
            return res.status(400).send("Token not received");
        }

        // STEP 2: Get User
        const userResponse = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const githubUser = userResponse.data;

        let user = await User.findOne({ githubId: githubUser.id });

        if (!user) {
            // 🆕 CREATE USER
            user = await User.create({
                githubId: githubUser.id,
                username: githubUser.login,
                avatar: githubUser.avatar_url,
            });

            console.log("🆕 New user created");
        } else {
            console.log("✅ Existing user");
        }
        const jwtToken = jwt.sign({
            id: user._id,
            username: user.username,
            avatar: user.avatar
        }, process.env.JWT_SECRET, {
            expiresIn: "24h"
        });

        res.cookie("jwtToken", jwtToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        console.log("✅ User:", user.username);

        return res.redirect("http://localhost:5173/dashboard");

    } catch (error) {
        console.log("❌ OAuth Error:", error.response?.data || error.message);
        return res.status(500).send("OAuth Failed");
    }
};