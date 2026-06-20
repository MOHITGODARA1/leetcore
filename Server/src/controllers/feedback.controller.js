import mongoose from "mongoose";
import Feedback from "../models/Feedback.models.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const submitFeedback = asyncHandler(async (req, res) => {
    const { userId, name, email, about, rating, message } = req.body;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }
    if (!name || !name.trim()) {
        throw new ApiError(400, "Name is required");
    }
    if (!email || !email.trim()) {
        throw new ApiError(400, "Email is required");
    }
    if (!about || !about.trim()) {
        throw new ApiError(400, "What's this about? is required");
    }
    if (rating === undefined || rating === null) {
        throw new ApiError(400, "How would you rate your experience? is required");
    }
    if (!message || !message.trim()) {
        throw new ApiError(400, "Feedback Message is required");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid User ID format");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        throw new ApiError(400, "Please provide a valid email address");
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        throw new ApiError(400, "Rating must be a number between 1 and 5");
    }

    const feedback = await Feedback.create({
        userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        about: about.trim(),
        rating: numericRating,
        message: message.trim(),
    });

    return res.status(201).json({
        success: true,
        message: "Thank you for your feedback. We appreciate your input and will use it to improve our platform.",
        feedback,
    });
});
