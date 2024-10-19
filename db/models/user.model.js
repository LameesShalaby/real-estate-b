import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /.+\@.+\..+/,
    },
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: Number, default: 2 },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{10,15}$/,
    },
    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    otp: { type: Number },
    otpExpires: { type: Date },
    favorites: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: [] },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
