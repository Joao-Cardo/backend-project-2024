import mongoose from "mongoose";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected.");

    await User.create({
      username: "admin",
      password: "admin123", // Needs hashing
      role: "admin",
    });
    console.log("Admin user created!");
  } catch (err) {
    console.error("Error creating admin user:", err.message);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

seedAdmin();
