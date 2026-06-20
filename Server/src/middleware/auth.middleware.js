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
        console.log("Auth middleware error:", error);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        })
    }

}


export default authMiddleware;
