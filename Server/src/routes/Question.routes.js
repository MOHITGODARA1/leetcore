import { Router } from "express";
import { getQuestionsByTopic } from "../controllers/Question.js";
const router = Router();

router.get("/:topic", getQuestionsByTopic);

export default router;