import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    topic: {
        type: String,
        required: true
    },

    solved: {
        type: Number,
        default: 0
    },

    easy: {
        solved: { type: Number, default: 0 }
    },

    medium: {
        solved: { type: Number, default: 0 }
    },

    hard: {
        solved: { type: Number, default: 0 }
    },

    solvedQuestions: [
        {
            question_name: String,
            difficulty: String
        }
    ]

}, { timestamps: true });

progressSchema.index({ userId: 1, topic: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);