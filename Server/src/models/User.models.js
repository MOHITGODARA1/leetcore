import mongoose from "mongoose";


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
        bio: {
            type: String,
            default: "",
        },
        name: {
            type: String,
            default: "",
            trim: true,
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


export default mongoose.model("User", UserSchema);

