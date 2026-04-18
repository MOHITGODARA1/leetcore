import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();
//  Redirect to GitHub
export const GithubLogin = async (req, res) => {
    try {
        const githubURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=user:email`;

        return res.redirect(githubURL);
    } catch (error) {
        console.error("Login Error:", error.message);
        return res.status(500).send("GitHub Login Failed");
    }
};

//  Callback
export const GithubCallback = async (req, res) => {
    const code = req.query.code;

    if (!code) {
        console.error("No code received");
        return res.status(400).send("No code provided");
    }

    try {
        //  STEP 1: Get Access Token
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            {
                headers: { Accept: "application/json" },
            }
        );

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            console.error("No access token");
            return res.status(400).send("Token not received");
        }

        //  STEP 2: Get GitHub User
        const userResponse = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const githubUser = userResponse.data;

        //  STEP 3: (Optional but recommended) Get Email
        let email = null;
        try {
            const emailRes = await axios.get("https://api.github.com/user/emails", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            email = emailRes.data.find(e => e.primary)?.email;
        } catch (err) {
            console.warn("Email fetch failed");
        }

        //  STEP 4: Find or Create User
        let user = await User.findOne({ githubId: githubUser.id });

        if (!user) {
            user = await User.create({
                githubId: githubUser.id,
                username: githubUser.login,
                avatar: githubUser.avatar_url,
                email: email || null,
            });
            console.log("New user created");
        } else {
            console.log(" Existing user");
        }

        //  STEP 5: JWT Token
        const jwtToken = jwt.sign(
            {
                id: user._id,
                username: user.username,
                avatar: user.avatar,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        //  STEP 6: Cookie (Production Ready)
        res.cookie("jwtToken", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", //  important
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        //  STEP 7: Redirect to frontend
        console.log(process.env.CLIENT_URL);
        return res.redirect(`${process.env.CLIENT_URL}/dashboard/dsa`);

    } catch (error) {
        console.error(" OAuth Error:", error.response?.data || error.message);
        return res.status(500).send("OAuth Failed");
    }
};