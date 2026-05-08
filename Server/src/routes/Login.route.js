import { Router } from "express";
import { githubLogin, registerUser, logoutUser } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import getCurrentUser from "../controllers/getuser.controller.js";

const router = Router();


router.get("/auth/github/login", githubLogin);

router.get("/auth/github/callback", registerUser);

router.post("/auth/logout", logoutUser);

router.get("/auth/me", authMiddleware, getCurrentUser);

export default router;