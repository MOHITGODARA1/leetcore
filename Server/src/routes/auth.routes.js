import { Router } from "express";
import { GithubCallback, GithubLogin } from "../controllers/LoginUser.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// OAuth
router.get("/github", GithubLogin);
router.get("/github/callback", GithubCallback);

// Dashboard API
router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

// Logout
router.get("/logout", (req, res) => {
    res.clearCookie("jwtToken");
    res.json({ message: "Logged out" });
});

export default router;