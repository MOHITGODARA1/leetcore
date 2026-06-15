import mongoose from "mongoose";
import BugReport from "../models/BugReport.models.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const submitBugReport = asyncHandler(async (req, res) => {
    const { userId, name, email, device, bugArea, bugTitle, bugDescription } = req.body;

    // Validate the presence of all required fields
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }
    if (!name || !name.trim()) {
        throw new ApiError(400, "Name is required");
    }
    if (!email || !email.trim()) {
        throw new ApiError(400, "Email is required");
    }
    if (!device || !device.trim()) {
        throw new ApiError(400, "Device is required");
    }
    if (!bugArea || !bugArea.trim()) {
        throw new ApiError(400, "Bug area is required");
    }
    if (!bugTitle || !bugTitle.trim()) {
        throw new ApiError(400, "Bug Title is required");
    }
    if (!bugDescription || !bugDescription.trim()) {
        throw new ApiError(400, "Bug Description is required");
    }

    // Validate formats & types
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid User ID format");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        throw new ApiError(400, "Please provide a valid email address");
    }

    // Save to the database
    const bugReport = await BugReport.create({
        userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        device: device.trim(),
        bugArea: bugArea.trim(),
        bugTitle: bugTitle.trim(),
        bugDescription: bugDescription.trim(),
        createdTimestamp: new Date(),
    });

    return res.status(201).json({
        success: true,
        message: "Thank you for reporting this issue. Our team has received your bug report and will investigate it as soon as possible.",
        bugReport,
    });
});
