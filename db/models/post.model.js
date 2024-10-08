import mongoose from "mongoose";

// PostDetail schema
const postDetailSchema = new mongoose.Schema({
  desc: { type: String, required: true },
  utilities: { type: String, required: false },
  pet: { type: String, required: false },
  income: { type: String, required: false },
  size: { type: Number, required: false },
  bedroom: { type: Number, required: true },
  bathroom: { type: Number, required: true },
  garage:{type: Number, required: true},
  type: {
    type: String,
    enum: ['buy', 'rent'],
    required: true,
  },

 //   nearby
  school: { type: Number, required: false },
  bus: { type: Number, required: false },
  restaurant: { type: Number, required: false },
  university:{ type: Number, required: false },
  grocerycenter:{ type: Number, required: false },
  market:{ type: Number, required: false },
  hospital:{ type: Number, required: false },
  metroStation:{ type: Number, required: false },
  gym:{ type: Number, required: false },

 postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", unique: true },
});

// Post schema
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

  type: {
    type: String,
    enum: ['buy', 'rent'],
    required: true,
  },
  property: {
    type: String,
    enum: ['apartment', 'house', 'villa'],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
 userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postDetail: postDetailSchema,
savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "SavedPost" }],
});

export default mongoose.model("Post", postSchema);