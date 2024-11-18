import mongoose from "mongoose";
import "./models/index";
const MONGO_URL = process.env.DATABASE_URL;

const connectDB = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already Connected");
    return;
  }

  if (connectionState === 2) {
    console.log("Connecting");
  }

  try {
    mongoose.set("strictPopulate", false);
    await mongoose.connect(MONGO_URL!, {
      dbName: "LosBlancos",
    });
  } catch (error) {
    console.log("Error in Connecting to database", error);
    throw new Error("Error connecting to database");
  }
};

export default connectDB;
