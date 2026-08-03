import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getActivitySummary, recordAcceptedSubmission } from "../controllers/activity.controller.js";

const router = Router();

router.get("/activity/summary", authMiddleware, getActivitySummary);
router.post("/activity/submissions/accepted", authMiddleware, recordAcceptedSubmission);

export default router;
