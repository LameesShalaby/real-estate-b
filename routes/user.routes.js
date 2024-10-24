import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticate } from "../middleware/authentication.js";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/details", userController.getUserId);
router.post("/",  userController.addUser);
router.patch("/:id", authenticate, userController.updateUser);
router.delete("/:id", authenticate, userController.deleteUser);
router.post("/update-password", userController.updatePasswordWithOTP);
export default router;
