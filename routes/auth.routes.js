import express from "express";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
// router.post("/logout", logout);
router.post("/forget-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export default router;
