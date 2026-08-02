import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aisense";
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected : ${conn.connection.host}`);
  } catch (error) {
    console.warn("⚠️ MongoDB Connection Warning:", error.message);
    console.log("ℹ️ Running in memory / local mode");
  }
};

export default connectDB;