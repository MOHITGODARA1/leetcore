import "dotenv/config";


import app from "./app.js";
import dbConnect from "./config/Connectdb.js"

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

dbConnect().catch((error) => {
    console.error(`Database connection failed: ${error.message}`);
});
