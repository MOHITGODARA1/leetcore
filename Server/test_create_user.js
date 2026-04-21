import mongoose from 'mongoose';
import User from './src/models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function testCreate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.create({
      githubId: "test_new_123456",
      username: "test_new_user",
      avatar: "https://example.com/avatar.png",
      email: null
    });
    console.log("CREATED USER:", user);
    console.log("ID for JWT:", user._id);
  } catch (err) {
    console.error("ERROR CREATING:", err);
  } finally {
    mongoose.disconnect();
  }
}
testCreate();
