import mongoose from "mongoose";
import { config } from "./config.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URL);

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌", error.message);
    process.exit(1);
  }
};