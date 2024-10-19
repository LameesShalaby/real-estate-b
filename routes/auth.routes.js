import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  forgetPassword,
  resetPassword,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/authentication.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authenticate, getUser);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.get("/", getAllUsers);
router.put("/update", authenticate, updateUser);
router.delete("/delete", authenticate, deleteUser);

export default router;
