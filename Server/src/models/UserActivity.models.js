import mongoose from "mongoose";

const SolvedQuestionSchema = new mongoose.Schema(
    {
        questionId: {
            type: String,
            required: true,
        },
        topicId: {
            type: String,
            required: true,
            index: true,
        },
        difficulty: {
            type: String,
            default: "Medium",
        },
        language: {
            type: String,
            default: "",
        },
        attempts: {
            type: Number,
            default: 1,
        },
        bestRuntimeMs: {
            type: Number,
            default: null,
        },
        bestMemoryKb: {
            type: Number,
            default: null,
        },
        firstSolvedAt: {
            type: Date,
            default: Date.now,
        },
        lastSolvedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const DailyActivitySchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true,
        },
        solvedCount: {
            type: Number,
            default: 0,
        },
        submissions: {
            type: Number,
            default: 0,
        },
    },
    { _id: false }
);

const UserActivitySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },
        solvedQuestions: {
            type: [SolvedQuestionSchema],
            default: [],
        },
        solvedCount: {
            type: Number,
            default: 0,
        },
        dailyActivity: {
            type: [DailyActivitySchema],
            default: [],
        },
        totalSubmissions: {
            type: Number,
            default: 0,
        },
        lastActivityAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

UserActivitySchema.pre("save", function setSolvedCount(next) {
    this.solvedCount = this.solvedQuestions.length;
    next();
});

UserActivitySchema.index({ solvedCount: -1 });
UserActivitySchema.index({ lastActivityAt: -1 });

export default mongoose.model("UserActivity", UserActivitySchema);
