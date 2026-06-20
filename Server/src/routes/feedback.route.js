import { Router } from "express";
import { submitFeedback } from "../controllers/feedback.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", submitFeedback);

export default router;
