import Review from "../models/review.model.js";
import { uploadFile } from "../services/storage.service.js";

// ➤ CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    let images = [];

    // ⭐ Upload images if exist
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
          folder: "reviews",
        });

        images.push({
          url: result.url,
          fileId: result.fileId,
        });
      }
    }

    const review = await Review.create({
      productId,
      userId: req.user._id,
      name: req.user.name,
      rating,
      comment,
      images, // ⭐ saved here
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ➤ GET REVIEWS FOR PRODUCT
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};