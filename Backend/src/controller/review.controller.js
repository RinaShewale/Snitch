import Review from "../models/review.model.js";
import User from "../models/user.model.js"; 
import { uploadFile } from "../services/storage.service.js";

export const createReview = async (req, res) => {
  try {
    const { productId, comment, rating } = req.body;
    
    // 1. Create the review
    const newReview = await Review.create({
      productId,
      userId: req.user._id,
      rating: Number(rating),
      comment,
      images: req.body.images || [], 
    });

    // 2. FETCH & POPULATE
    const populatedReview = await Review.findById(newReview._id)
      .populate({
        path: "userId",
        select: "fullName email avatar" // Explicitly get these 3 fields
      })
      .lean();

    return res.status(201).json({
      success: true,
      review: populatedReview,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate({
        path: "userId",
        select: "fullName email avatar"
      })
      .sort("-createdAt")
      .lean();

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};