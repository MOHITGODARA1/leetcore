import mongoose from "mongoose";

const StrakSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    lastLoginDate: {
        type: Date,
        default: Date.now
    },
    lastResetDate: {
        type: Date,
        default: Date.now
    },
    activeDates: {
        type: [String],
        default: []
    }
}, { timestamps: true });

export default mongoose.model("Streak", StrakSchema);