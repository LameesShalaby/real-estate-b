import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: Number, default: 2 },
  phoneNumber: { type: String, required: true },
  avatar: { type: String, default: null, required: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
