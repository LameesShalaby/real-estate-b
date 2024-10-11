import { Router } from "express";
import * as postController from "../controllers/post.controller.js";
import { authenticate } from "../middleware/authentication.js";

const router = Router();

router.get("/", postController.getAllPosts);
router.get("/favourite", authenticate, postController.getAllFavourite);
router.post("/add-favourite", authenticate, postController.addFavourites);
router.post("/", authenticate, postController.addPost);
router.patch("/:id", authenticate, postController.updatePost);
router.delete("/:id", authenticate, postController.deletePost);
router.post("/:id/comments", postController.addComment);
export default router;
