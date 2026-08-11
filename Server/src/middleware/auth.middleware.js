import jwt from "jsonwebtoken";

const getBearerToken = (req) => {
    const authHeader = req.get("authorization") || "";

    if (!authHeader.startsWith("Bearer ")) {
        return "";
    }

    return authHeader.slice("Bearer ".length).trim();
};

const authMiddleware = async (req, res, next) => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT secret is not configured");
        }

        const token = req.cookies?.token || getBearerToken(req);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;

        next();
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error("Auth middleware error:", error.message);
        }

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        })
    }

}


export default authMiddleware;
