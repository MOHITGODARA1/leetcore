import express from "express";
import LoginRouter from "./routes/Login.route.js";
import CompilerRouter from "./routes/compiler.route.js";
import ActivityRouter from "./routes/activity.route.js";
import ProfileRouter from "./routes/profile.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import errorMiddleware from "./middleware/error.middleware.js";
import mongoose from "mongoose";

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "http://localhost:5180",
    "http://127.0.0.1:5180",
    process.env.CLIENT_URL,
].filter(Boolean);

const isProductionLike = process.env.NODE_ENV === "production" || process.env.CLIENT_URL?.startsWith("https://");

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
}));

app.use(express.json({ limit: "256kb" }));

const apiRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 240,
    standardHeaders: true,
    legacyHeaders: false,
});

app.use("/api/v1", apiRateLimiter);

const csrfProtection = csurf({
    cookie: {
        httpOnly: true,
        sameSite: isProductionLike ? "none" : "lax",
        secure: isProductionLike,
    },
});

app.use("/api/v1", CompilerRouter);
app.use(csrfProtection);

app.get("/api/v1/csrf-token", (req, res) => {
    res.status(200).json({ csrfToken: req.csrfToken() });
});

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
});

// route handling
app.use("/api/v1", LoginRouter);
app.use("/api/v1", ActivityRouter);
app.use("/api/v1", ProfileRouter);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.use(errorMiddleware);

export default app;
