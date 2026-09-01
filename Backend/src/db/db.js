import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI?.trim();

    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing in the environment variables.");
    }

    const normalizedUri = mongoUri.replace(/\/+$/, "");
    const connectionString = /\/[A-Za-z0-9_-]+$/i.test(normalizedUri)
      ? normalizedUri
      : `${normalizedUri}/${DB_NAME}`;

    const connectionInstance = await mongoose.connect(connectionString);
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
