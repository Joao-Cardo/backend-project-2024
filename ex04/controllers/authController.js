import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";

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

    //Validate password
    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    //Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET, // 'password' to enconde the token
      { expiresIn: "1h" }, //token visibility
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};
