import mongoose from "mongoose";
import { setTimeout } from "timers/promises";

if (!process.env.MONGODB_URI) {
  throw new Error("请在环境变量中设置 MONGODB_URI");
}

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "blog";

let isConnected = false;
const connectWithRetry = async (retries = 5, delay = 5000) => {
  try {
    await mongoose.connect(MONGODB_URI || "", {
      dbName: DB_NAME,
    });
    isConnected = true;
    console.log("连接成功");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    if (retries > 0) {
      console.log(`将在 ${delay / 1000}s 后重试 (${retries}次)`);
      await setTimeout(delay);
      return connectWithRetry(retries - 1, delay);
    } else {
      throw new Error("多次尝试后仍然失败");
    }
  }
};

export const connectDB = async () => {
  if (isConnected) return;
  await connectWithRetry();
};
