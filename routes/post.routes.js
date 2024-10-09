import { Router } from "express";
import * as postController from "../controllers/post.controller.js";

const router = Router();

router.delete("/:id", postController.deletePost);
router.put("/:id", postController.updatePost);

export default router;