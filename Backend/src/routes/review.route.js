import express from "express";
import { createReview, getProductReviews } from "../controller/review.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../services/multer.js";

const router = express.Router();

// Changed .fields to .array to ensure req.files is a simple array
router.post(
  "/",
  protect,
  upload.array("images", 5), 
  createReview
);

router.get("/:productId", getProductReviews);

export default router;