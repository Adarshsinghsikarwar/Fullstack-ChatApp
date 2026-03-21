import mogoose from "mongoose";
import { config } from "./config.js";

export const connectDB = async () => {
  try {
    await mogoose.connect(config.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
