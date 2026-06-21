import Review from "../models/review.model.js";
import { uploadFile } from "../services/storage.service.js";

export const createReview = async (req, res) => {
  try {
    const { productId, comment, rating } = req.body;
    
    let imageUrls = [];
    
    if (req.files && req.files.length > 0) {
      // Pass the entire 'file' object (which contains .buffer and .originalname)
      const uploadPromises = req.files.map(file => uploadFile(file));
      const results = await Promise.all(uploadPromises);
      
      imageUrls = results.map(result => ({
        url: result.url // ImageKit returns 'url' or 'thumbnailUrl'
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
      .populate({ path: "userId", select: "fullName email avatar" })
      .lean();

    return res.status(201).json({ success: true, review: populatedReview });
  } catch (err) {
    console.error("Review Creation Error:", err);
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