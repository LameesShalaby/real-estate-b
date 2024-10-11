import express from "express";
import { uploadImages } from "../controllers/image.controller.js";
import upload from "../middleware/multer.js";
const router = express.Router();

router.post("/upload-image", upload.any(), uploadImages);

export default router;
