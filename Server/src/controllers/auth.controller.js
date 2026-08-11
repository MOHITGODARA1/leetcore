import User from "../models/User.models.js";
import axios from "axios";
import https from "node:https";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const DEFAULT_CLIENT_URL = "http://localhost:5174";
const DEFAULT_SERVER_URL = "http://localhost:4000";

const requiredEnv = (key) => {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
};

const trimTrailingSlash = (url) => url?.replace(/\/$/, "");

const isProductionUrl = (url = "") => url.startsWith("https://");

const getClientUrl = () => trimTrailingSlash(process.env.CLIENT_URL || DEFAULT_CLIENT_URL);

const redirectWithAuthError = (res, reason) => {
    const clientUrl = getClientUrl();
    const redirectUrl = new URL(clientUrl);
    redirectUrl.searchParams.set("auth_error", reason || "github_login_failed");

    return res.redirect(redirectUrl.toString());
};

const normalizeUsername = (value = "") => {
    const normalized = value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^[-_]+|[-_]+$/g, "");

    return normalized.slice(0, 30) || "leetcore-user";
};

const getAvailableUsername = async (preferredUsername, currentUserId = null) => {
    const base = normalizeUsername(preferredUsername).slice(0, 24);
    let candidate = base.length >= 3 ? base : `${base}user`.slice(0, 24);
    let suffix = 1;

    while (await User.exists({
        username: candidate,
        ...(currentUserId ? { _id: { $ne: currentUserId } } : {}),
    })) {
        suffix += 1;
        candidate = `${base}-${suffix}`.slice(0, 30);
    }

    return candidate;
};

const shouldAllowSelfSignedGithubCerts = () =>
    process.env.NODE_ENV !== "production"
    && process.env.GITHUB_ALLOW_SELF_SIGNED_CERTS === "true";

const githubHttpClient = axios.create({
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    ...(shouldAllowSelfSignedGithubCerts()
        ? {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        }
        : {}),
});

const getAuthCookieOptions = () => {
    const clientUrl = process.env.CLIENT_URL || DEFAULT_CLIENT_URL;
    const useSecureCookie = process.env.NODE_ENV === "production" || isProductionUrl(clientUrl);

    return {
        httpOnly: true,
        secure: useSecureCookie,
        sameSite: useSecureCookie ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
};

const getGithubCallbackUrl = () => {
    if (process.env.GITHUB_CALLBACK_URL) {
        return process.env.GITHUB_CALLBACK_URL;
    }

    const serverUrl = trimTrailingSlash(
        process.env.PUBLIC_API_URL || process.env.RENDER_EXTERNAL_URL || DEFAULT_SERVER_URL
    );

    return `${serverUrl}/api/v1/auth/github/callback`;
};

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
    let authStep = "starting GitHub authentication";

    try {

        // Get code from GitHub
        authStep = "reading GitHub callback code";
        if (req.query.error) {
            return redirectWithAuthError(res, String(req.query.error));
        }

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
        authStep = "exchanging GitHub code for access token";
        const tokenResponse = await githubHttpClient.post(
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
                message: "Authentication failed",
                step: authStep,
                error: tokenResponse.data.error_description || "GitHub did not return an access token",
            });
        }

        // Fetch GitHub user
        authStep = "fetching GitHub user profile";
        const githubUser = await githubHttpClient.get(
            "https://api.github.com/user",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // Fetch email
        authStep = "fetching GitHub email";
        const emailResponse = await githubHttpClient.get(
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

        if (mongoose.connection.readyState !== 1) {
            throw new Error("Database is not connected");
        }

        // Find existing user
        authStep = "finding existing user";
        let user = await User.findOne(existingUserQuery);

        // Create user if not exists
        if (!user) {

            authStep = "creating user";
            user = await User.create({
                ...userData,
                username: await getAvailableUsername(login),
            });

        } else {

            authStep = "updating user";
            user.set(userData);
            user.set("githubAccessToken", undefined);
            await user.save();

        }

        // Generate JWT
        authStep = "creating JWT";
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
        res.cookie("token", token, getAuthCookieOptions());

        const clientUrl = trimTrailingSlash(process.env.CLIENT_URL || DEFAULT_CLIENT_URL);

        return res.redirect(clientUrl);

    } catch (error) {
        try {
            const fs = await import("node:fs");
            fs.appendFileSync("debug.log", `[${new Date().toISOString()}] GitHub Auth Error: ${authStep} - ${error.stack || error.message} - Response: ${JSON.stringify(error.response?.data || {})}\n`);
        } catch (e) {
            console.error("Failed to write to debug.log:", e);
        }

        const statusCode = error.response?.status || 500;
        const providerMessage = error.response?.data?.error_description
            || error.response?.data?.message
            || error.message;

        console.error("GitHub Auth Error:", {
            step: authStep,
            status: statusCode,
            message: providerMessage,
        });

        if (req.accepts("html")) {
            return redirectWithAuthError(res, "github_login_failed");
        }

        return res.status(statusCode >= 400 && statusCode < 500 ? statusCode : 500).json({
            success: false,
            message: "Authentication failed",
            step: authStep,
            error: process.env.NODE_ENV === "production" ? undefined : providerMessage,
        });

    }

};


const logoutUser = async (req, res) => {
    try {

        res.clearCookie("token", getAuthCookieOptions());

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
