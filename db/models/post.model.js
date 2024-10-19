import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    address: { type: String, required: true },
    city: { type: String, required: true },
    bedroom: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
    sqft: { type: Number, required: true },
    type: { type: String, enum: ["buy", "rent"], required: true },
    property: {
      type: String,
      enum: ["apartment", "house", "villa", "studio"],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["published", "sold", "under review"],
      default: "under review",
    },
    amenities: {
      type: [String],
      enum: [
        "air condition",
        "heating",
        "floor",
        "elevator",
        "garden",
        "parking",
        "intercom",
        "security",
        "wifi",
        "window type",
        "pool",
        "shared gym",
        "shared spa",
        "fireplace",
        "cable tv",
      ],
      required: true,
    },
    featured: { type: Boolean, default: false },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: { type: String, required: true, maxlength: 500 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
