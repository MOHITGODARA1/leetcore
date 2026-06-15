import mongoose from "mongoose";

const BugReportSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        device: {
            type: String,
            required: true,
            trim: true,
        },
        bugArea: {
            type: String,
            required: true,
            trim: true,
        },
        bugTitle: {
            type: String,
            required: true,
            trim: true,
        },
        bugDescription: {
            type: String,
            required: true,
            trim: true,
        },
        createdTimestamp: {
            type: Date,
            default: Date.now,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("BugReport", BugReportSchema);
