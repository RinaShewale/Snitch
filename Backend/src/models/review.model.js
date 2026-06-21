import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // REMOVE THE "name: Anonymous" line from here!
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    images: [{ url: String, fileId: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);