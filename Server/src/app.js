import express from "express";
import LoginRouter from "./routes/Login.route.js";
import badgeRouter from "./routes/badge.route.js";
import activityRouter from "./routes/activity.route.js";
import feedbackRouter from "./routes/feedback.route.js";
import bugRouter from "./routes/bug.route.js";
import sponsorshipRouter from "./routes/sponsorship.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error.middleware.js";
import mongoose from "mongoose";

const app = express();

app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
}));
app.use(express.json());


app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
});

//route handling

// app.use("/v1/api", LoginRouter);
app.use("/api/v1", LoginRouter);
app.use("/api/v1/badges", badgeRouter);
app.use("/api/v1/activity", activityRouter);
app.use("/api/v1/feedback", feedbackRouter);
app.use("/api/v1/bugs", bugRouter);
app.use("/api/v1/sponsorship", sponsorshipRouter);

// Compatibility aliases for clients following the unversioned route examples.
app.use("/api/badges", badgeRouter);
app.use("/api/activity", activityRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/bugs", bugRouter);
app.use("/api/sponsorship", sponsorshipRouter);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.use(errorMiddleware);


export default app;
