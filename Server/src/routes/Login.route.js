import { Router } from "express";
import rateLimit from "express-rate-limit";
import { githubLogin, registerUser, logoutUser } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import getCurrentUser from "../controllers/getuser.controller.js";

const router = Router();

const currentUserRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

const authStartRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const authCallbackRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/auth/github/login", authStartRateLimiter, githubLogin);

router.get("/auth/github/callback", authCallbackRateLimiter, registerUser);

router.post("/auth/logout", logoutUser);

router.get("/auth/me", currentUserRateLimiter, authMiddleware, getCurrentUser);

export default router;
