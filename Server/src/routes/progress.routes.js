import express from "express";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();

import {
    getProgress,
    updateProgress
} from "../controllers/Progress.controller.js";

// GET progress
router.get("/", authMiddleware, getProgress);

// UPDATE progress
router.post("/update", authMiddleware, updateProgress);

export default router;