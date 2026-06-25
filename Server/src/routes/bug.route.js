import { Router } from "express";
import rateLimit from "express-rate-limit";
import { submitBugReport } from "../controllers/bug.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

const bugReportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(bugReportLimiter);
router.use(authMiddleware);

router.post("/", submitBugReport);

export default router;
