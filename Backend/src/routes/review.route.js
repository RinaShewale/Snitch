import express from "express";
import {
  createReview,
  getProductReviews,
} from "../controller/review.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../services/multer.js"; // 👈 your service path

const router = express.Router();

// ➤ CREATE REVIEW (WITH IMAGES SUPPORT)
router.post(
  "/",
  protect,
  upload.array("images", 5), // up to 5 images
  createReview
);

// ➤ GET REVIEWS FOR A PRODUCT
router.get("/:productId", getProductReviews);

export default router;