const errorMiddleware = (error, req, res, next) => {
    const statusCode = error.statusCode || error.status || 500;

    if (process.env.NODE_ENV !== "test") {
        console.error(error);
    }

    return res.status(statusCode).json({
        success: false,
        message: error.code === "EBADCSRFTOKEN"
            ? "Security token expired. Please refresh and try again."
            : error.message || "Internal server error",
        ...(error.code ? { code: error.code } : {}),
        ...(error.details ? { details: error.details } : {}),
    });
};

export default errorMiddleware;
