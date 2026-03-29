import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        githubId: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        avatar: {
            type: String,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
