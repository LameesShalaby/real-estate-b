import express from "express";
import cors from "cors";
import connectDB from "./db/database.js";
import userRouter from "./users/user.router.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
