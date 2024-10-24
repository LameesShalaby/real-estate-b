import { Router } from "express";
import * as postController from "../controllers/post.controller.js";
import { authenticate } from "../middleware/authentication.js";

const router = Router();

router.get("/", postController.getAllPosts);
router.get("/user/favourite", authenticate, postController.getAllFavourite);
router.post("/user/favourite", authenticate, postController.addFavourites);
router.delete("/user/favourite", authenticate, postController.removeFavourites);
router.get("/filter", postController.getFilteredPosts);
router.get("/:id", postController.getPostDetails);
router.post("/", authenticate, postController.addPost);
router.patch("/:id", authenticate, postController.updatePost);
router.delete('/:postId/comments/:commentId',postController.deleteComment);
router.delete("/:id", authenticate, postController.deletePost);
router.post("/:id/comments", authenticate, postController.addComment);
router.get('/user/reviews', authenticate, postController.getUserReviews);

export default router;
