import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
    awardBadgeToUser,
    createBadge,
    getAllBadges,
    getSingleBadge,
    getUserBadges,
    removeBadgeFromUser,
} from "../controllers/badge.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

const getSingleBadgeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

const userBadgeMutationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

router.route("/")
    .get(getAllBadges)
    .post(authMiddleware, createBadge);

router.post("/award", authMiddleware, awardBadgeToUser);
router.get("/user/:userId", authMiddleware, getUserBadges);
router.delete("/user/:userId/:badgeId", authMiddleware, userBadgeMutationLimiter, removeBadgeFromUser);
router.get("/:id", getSingleBadgeLimiter, getSingleBadge);

export default router;
