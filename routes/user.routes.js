import { Router } from "express";
import * as userController from "../controllers/user.controller.js";

const router = Router();

router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/profile/:userId", userController.updateProfile);


export default router;