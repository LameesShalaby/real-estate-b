import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticate } from "../middleware/authentication.js";

const router = Router();

router.get("/", userController.getAllUsers);
router.patch("/", authenticate, userController.updateUser);
router.delete("/", authenticate, userController.deleteUser);

export default router;
