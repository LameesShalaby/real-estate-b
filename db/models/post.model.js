import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  // images: [{ type: String }],
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

  comments: [{ type: String, defult: "" }],

});

export default mongoose.model("Post", postSchema);
