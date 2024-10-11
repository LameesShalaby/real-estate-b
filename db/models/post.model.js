import mongoose from "mongoose";

const postDetailSchema = new mongoose.Schema({
  desc: { type: String, required: true },
  utilities: { type: String },
  pet: { type: String },
  income: { type: String },
  size: { type: Number },
  bedroom: { type: Number, required: true },
  bathroom: { type: Number, required: true },
  garage: { type: Number },
  type: { type: String, enum: ["buy", "rent"], required: true },
  school: { type: Number },
  bus: { type: Number },
  restaurant: { type: Number },
  university: { type: Number },
  grocerycenter: { type: Number },
  market: { type: Number },
  hospital: { type: Number },
  metroStation: { type: Number },
  gym: { type: Number },
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String, required: true }],
  address: { type: String, required: true },
  city: { type: String, required: true },
  bedroom: { type: Number, required: true },
  bathroom: { type: Number, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  type: { type: String, enum: ["buy", "rent"], required: true },
  property: {
    type: String,
    enum: ["apartment", "house", "villa"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postDetail: postDetailSchema,
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "SavedPost" }],
  comments: [
    {
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
});

export default mongoose.model("Post", postSchema);
