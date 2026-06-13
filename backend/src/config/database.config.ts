import mongoose from "mongoose";
import { ENV } from "./env.config";

const connectDatabase = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Set a timeout for server selection
      socketTimeoutMS: 5000, // Set a timeout for socket operations
      connectTimeoutMS: 5000, // Set a timeout for initial connection
    });
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the process with an error code
  }
};

export default connectDatabase;
