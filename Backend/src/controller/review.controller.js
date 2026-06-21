import Review from "../models/review.model.js";
import { uploadFile } from "../services/storage.service.js";

export const createReview = async (req, res) => {
  try {
    const { productId, comment, rating } = req.body;

    let imageUrls = [];

    // req.files is an array because we used upload.array() in routes
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
          folder: "reviews",
        })
      );

      const results = await Promise.all(uploadPromises);

      imageUrls = results.map((result) => ({
        url: result.url,
      }));
    }

    
    const newReview = await Review.create({
      productId,
      userId: req.user._id,
      rating: Number(rating),
      comment,
      images: imageUrls,
    });

    const populatedReview = await Review.findById(newReview._id)
      .populate({
        path: "userId",
        select: "fullName email avatar"
      })
      .lean();

    return res.status(201).json({
      success: true,
      review: populatedReview,
    });
  } catch (err) {
    console.error("Create Review Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId })
      .populate({ path: "userId", select: "fullName email avatar" })
      .sort("-createdAt")
      .lean();

    return res.status(200).json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};