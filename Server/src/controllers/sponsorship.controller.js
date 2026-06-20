import Sponsorship from "../models/Sponsorship.models.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const submitSponsorshipRequest = asyncHandler(async (req, res) => {
    const { companyName, contactName, email, phone, message } = req.body;

    // Validate presence of all required fields
    if (!companyName || !companyName.trim()) {
        throw new ApiError(400, "Organization/Company Name is required");
    }
    if (!contactName || !contactName.trim()) {
        throw new ApiError(400, "Contact Person Name is required");
    }
    if (!email || !email.trim()) {
        throw new ApiError(400, "Email Address is required");
    }
    if (!phone || !phone.trim()) {
        throw new ApiError(400, "Phone Number is required");
    }
    if (!message || !message.trim()) {
        throw new ApiError(400, "Sponsorship Details / Message is required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        throw new ApiError(400, "Please provide a valid email address");
    }

    // Save sponsorship request to the database
    const sponsorship = await Sponsorship.create({
        companyName: companyName.trim(),
        contactName: contactName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        message: message.trim(),
        createdTimestamp: new Date(),
    });

    return res.status(201).json({
        success: true,
        message: "Thank you for your interest in sponsoring our platform. Our team has received your request and will contact you shortly to discuss the opportunity.",
        sponsorship,
    });
});
