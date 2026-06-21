import Review from "../models/review.model.js";
import { uploadFile } from "../services/storage.service.js";

export const createReview = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized ❌",
      });
    }

    const { productId, rating, comment } = req.body;

    if (!productId || rating === undefined || !comment?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Missing fields ❌",
      });
    }

    const parsedRating = Number(rating);

    if (isNaN(parsedRating)) {
      return res.status(400).json({
        success: false,
        message: "Invalid rating ❌",
      });
    }

    let images = [];

    if (Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files) {
        try {
          if (!file?.buffer) continue;

          const result = await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
            folder: "reviews",
          });

          if (result?.url) {
            images.push({
              url: result.url,
              fileId: result.fileId,
            });
          }
        } catch (err) {
          console.log("Image upload failed:", err.message);
        }
      }
    }

    const review = await Review.create({
      productId,
      userId: user._id,
      name: user?.name || "Anonymous",
      rating: parsedRating,
      comment,
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully ✅",
      review,
    });

  } catch (error) {
    console.log("CREATE REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId required ❌",
      });
    }

    const reviews = await Review.find({ productId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews: reviews || [],
    });

  } catch (error) {
    console.log("❌ GET REVIEWS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};