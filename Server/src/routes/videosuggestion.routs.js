import { Router } from "express";
import { getVideoSuggestion } from "../controllers/videoSuggestion.controller.js";

const router = Router();

router.get("/", getVideoSuggestion);
router.get("/:topic", getVideoSuggestion);

export default router;