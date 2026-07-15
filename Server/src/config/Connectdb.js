import mongoose from "mongoose";
import dns from "dns";

const dbConnect = async () => {
    if (!process.env.DB_URL) {
        throw new Error("Missing required environment variable: DB_URL");
    }

    try {
        // Set reliable public DNS servers to resolve MongoDB SRV/TXT records
        // and avoid DNS lookup timeouts (ETIMEOUT) on local routers.
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (dnsError) {
        console.warn("Could not set custom DNS servers:", dnsError.message);
    }

    await mongoose.connect(process.env.DB_URL, {
        serverSelectionTimeoutMS: 5000,
    });

    console.log("Database connected successfully");
};

export default dbConnect;
