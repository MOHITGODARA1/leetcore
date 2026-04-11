import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import questionRoutes from "./routes/Question.routes.js";
import progressRoutes from "./routes/progress.routes.js";
const app = express();


app.use(cors({ origin: ["http://localhost:5173", "https://leetcore-1.onrender.com"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v2/questions", questionRoutes);
app.use("/api/v3/progress", progressRoutes);
export default app;