import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  address: { type: String, required: true },
  city: { type: String, required: true },
  bedroom: { type: Number, required: true },
  bathroom: { type: Number, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  sqft: { type: Number, required: true }, 
  type: { type: String, enum: ["buy", "rent"], required: true },
  property: {
    type: String,
    enum: ["apartment", "house", "villa","studio"],
    required: true,
  },
  location: {
    type: String,
    enum: ["london", "sydney", "new gersy"],
    required: true,
  },
  amenites: {
    type: Boolean,
    enum: ["air condtion", "heating", "floor","elevator","garden","parking","intercom","security","wifi","window type","pool","sheard gym","sherd spa","fireplace","cable tv"],
    required: true,
  },
  featured:{type: Boolean},
  createdAt: { type: Date, default: Date.now },
  comments: [{ type: String, defult: "" }],

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

});

export default mongoose.model("Post", postSchema);