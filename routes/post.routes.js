import express from "express";
import {
  addPost,
  getAllPosts,
  getPostDetails,
  updatePost,
  deletePost,
  addComment,
  getAllComments,
  addFavorite,
  removeFavorite,
  getFilteredPosts,
//   getAllFavorites,
} from "../controllers/post.controller.js";
import { authenticate } from "../middleware/authentication.js";

const router = express.Router();

router.post("/", authenticate, addPost);
router.get("/", getAllPosts);
router.get("/:id", getPostDetails);
router.put("/:id", authenticate, updatePost);
router.delete("/:id", authenticate, deletePost);
router.post("/:id/comments", authenticate, addComment);
router.get("/:id/comments", getAllComments);
// router.get("/favorites", authenticate, getAllFavorites); 
router.post("/:id/favorites", authenticate, addFavorite);
router.delete("/:id/favorites", authenticate, removeFavorite);
router.get("/filter", getFilteredPosts);

export default router;
