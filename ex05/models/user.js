import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, min: 8 },
  role: { type: String, enum: ["admin", "regular"], default: "regular" },
});

const User = mongoose.model("User", userSchema);
export default User;
