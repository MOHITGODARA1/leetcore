import mongoose from 'mongoose';
import User from './src/models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkIndex() {
  await mongoose.connect(process.env.MONGO_URI);
  const indexes = await User.collection.indexes();
  console.log(indexes);
  mongoose.disconnect();
}
checkIndex();
