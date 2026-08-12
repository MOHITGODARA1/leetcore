import mongoose from "mongoose";

const dbConnect = async () => {
    if (!process.env.DB_URL) {
        throw new Error("Missing required environment variable: DB_URL");
    }

    await mongoose.connect(process.env.DB_URL, {
        serverSelectionTimeoutMS: 5000,
    });

    console.log("Database connected successfully");
};

export default dbConnect;
