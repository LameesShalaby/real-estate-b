import { Router } from "express";
import * as postController from "../controllers/post.controller.js";
import { authenticate } from "../middleware/authentication.js";

const router = Router();

router.delete("/:id", postController.deletePost);


export default router;
