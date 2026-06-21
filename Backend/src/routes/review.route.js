import express from "express";
import {
  createReview,
  getProductReviews,
} from "../controller/review.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../services/multer.js";

const router = express.Router();

// ✅ FINAL FIX ROUTE (IMPORTANT)
router.post(
  "/",
  protect,
  upload.fields([{ name: "images", maxCount: 5 }]),
  createReview
);

// GET REVIEWS
router.get("/:productId", getProductReviews);

export default router;