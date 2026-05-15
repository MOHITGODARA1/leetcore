import "dotenv/config";
import app from "./app.js";
import dbConnect from "./config/Connectdb.js"

const PORT = process.env.PORT || 4000;

dbConnect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.log("Database connection failed", error);
});
