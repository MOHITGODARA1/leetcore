
import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import ConnectDB from "./ConnectDB/connect.js";


const PORT = process.env.PORT || 3000;

ConnectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}).catch((error) => {
    console.log(error);
    process.exit(1);
})
