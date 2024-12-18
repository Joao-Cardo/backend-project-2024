import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Problem connecting to the database:", error);
    process.exit(1); //exit the backend database
  }
};

export default connectToDatabase;
