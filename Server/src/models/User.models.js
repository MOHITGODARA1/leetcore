import mongoose from "mongoose";


const UserSchema = new mongoose.Schema(
    {
        githubId: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minlength: 3,
            maxlength: 30,
            match: /^[a-z0-9_-]+$/,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: true,
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
            maxlength: 80,
        },
        publicProfileEnabled: {
            type: Boolean,
            default: true,
            index: true,
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

UserSchema.index({ username: 1, publicProfileEnabled: 1 });


export default mongoose.model("User", UserSchema);
