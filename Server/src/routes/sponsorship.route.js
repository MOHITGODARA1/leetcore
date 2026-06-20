import { Router } from "express";
import { submitSponsorshipRequest } from "../controllers/sponsorship.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", submitSponsorshipRequest);

export default router;
