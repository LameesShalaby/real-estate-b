import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// import open from "open";
import connectDB from "./db/database.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
// import passwordRoutes from "./routes/password.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/images", express.static("images"));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/uploads", uploadRoutes);
// app.use("/password", passwordRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  // open(`http://localhost:${port}`);
});
