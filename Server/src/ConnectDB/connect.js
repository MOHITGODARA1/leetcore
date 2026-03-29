import mongoose from "mongoose";
const ConnectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        const instanse = await mongoose.connect(`${MONGO_URI}`)
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default ConnectDB;