import { Router } from "express";
import * as postController from "../controllers/post.controller.js";

const router = Router();

router.get('/', postController.getAllPosts);
router.post('/', postController.addPost);
router.delete("/:id", postController.deletePost);


export default router;