import { Router } from "express";
import { submitBugReport } from "../controllers/bug.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", submitBugReport);

export default router;
