import mongoose from "mongoose";

const UserBadgeSchema = new mongoose.Schema(
    {
        badgeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Badge",
            required: true,
        },
        earnedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: false,
    }
);

const UserSchema = new mongoose.Schema(
    {
        githubId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: true,
            index: true,
        },
        avatar: {
            type: String,
            default: "",
        },
        profileUrl: {
            type: String,
            default: "",
        },
        githubAccessToken: {
            type: String,
            default: "",
            select: false,
        },
        bio: {
            type: String,
            default: "",
        },
        name: {
            type: String,
            default: "",
            trim: true,
        },
        stats: {
            totalActiveDays: {
                type: Number,
                default: 0,
            },

            currentStreak: {
                type: Number,
                default: 0,
            },

            maxStreak: {
                type: Number,
                default: 0,
            },

            totalStudyMinutes: {
                type: Number,
                default: 0,
            },

            totalProblemsSolved: {
                type: Number,
                default: 0,
            },

            consistencyPercentage: {
                type: Number,
                default: 0,
                min: 0,
                max: 100,
            },

            lastActiveDate: {
                type: String,
                default: null,
            },
        },
        badges: {
            type: [UserBadgeSchema],
            default: [],
        },
        xp: {
            type: Number,
            default: 0,
            min: 0,
        },
        level: {
            type: Number,
            default: 1,
            min: 1,
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.index({ "badges.badgeId": 1 });

export default mongoose.model("User", UserSchema);
