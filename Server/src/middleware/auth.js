import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// simple in-memory cache
const userCache = new Map();

// cache TTL (e.g., 5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.jwtToken;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // 1. Check cache first
        const cached = userCache.get(userId);
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
            req.user = cached.data;
            return next();
        }

        // 2. DB query with optimization
        const start = Date.now();

        const user = await User.findById(userId)
            .select("name email avatar") // only required fields
            .lean(); // faster than normal mongoose doc

        console.log("DB TIME:", Date.now() - start, "ms");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // 3. Store in cache
        userCache.set(userId, {
            data: user,
            timestamp: Date.now()
        });

        req.user = user;
        next();

    } catch (error) {
        console.error("Auth Error:", error.message);
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default authMiddleware;