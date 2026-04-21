import { Router } from "express";
import { getStreak } from "../controllers/streak.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleware, getStreak);

export default router;
