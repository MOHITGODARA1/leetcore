import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
    getConsistencyData,
    getDashboardStats,
    getStreakData,
    getUserActivity,
    markDailyActivity,
} from "../controllers/activity.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

const activityRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
});

router.use(authMiddleware);
router.use(activityRateLimiter);

router.post("/mark", markDailyActivity);
router.get("/user/:userId", getUserActivity);
router.get("/streak/:userId", getStreakData);
router.get("/consistency/:userId", getConsistencyData);
router.get("/dashboard/:userId", getDashboardStats);

export default router;
