import { Router } from "express";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middleware/auth.middleware.js";
import { getPublicProfile, updateMyProfile } from "../controllers/profile.controller.js";

const router = Router();

const publicProfileRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
});

const profileUpdateRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
});

router.get("/profiles/:username", publicProfileRateLimiter, getPublicProfile);
router.patch("/users/me/profile", profileUpdateRateLimiter, authMiddleware, updateMyProfile);

export default router;
