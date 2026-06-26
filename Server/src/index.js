import "dotenv/config";
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import app from "./app.js";
import dbConnect from "./config/Connectdb.js"

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

dbConnect().catch((error) => {
    console.error(`Database connection failed: ${error.message}`);
});
