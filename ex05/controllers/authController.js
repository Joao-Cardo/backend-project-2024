import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

// Login logic
export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    //Check if user exists
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    //Validate password (user.password is the hash)
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    //Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET, // 'password' to encode the token
      { expiresIn: "1h" }, //token visibility
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    //Check if the username is taken in the database
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ error: "Username already exists." });
    } else {
      const pw = hashPassword(password);
      const user = new User({ username, pw, role });
      await user.save();
      res.status(201).json({ message: "User registered successfully." });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const hashPassword = async (plainPassword) => {
  try {
    const saltRounds = 10; // Recommended value
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};
