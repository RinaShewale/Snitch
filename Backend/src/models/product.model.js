import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    price: {
      type: priceSchema,
      required: true,
    },

    images: [
      {
        url: String,
        fileId: String,
        alt: String,
      },
    ],

    // --- UPDATED VARIANTS SECTION ---
    variants: [
      {
        size: {
          type: String, // Useful for Clothes (S, M, L) and Footwear (UK 8, EU 42)
          trim: true,
        },

        color: {
          type: String, // Useful for all categories
          trim: true,
        },

        material: {
          type: String, // Useful for Bags (Leather, Canvas) and Accessories
          trim: true,
        },

        stock: {
          type: Number,
          default: 0,
          min: 0,
        },

        price: {
          type: priceSchema,
          required: true,
        },

        images: [
          {
            url: String,
            fileId: String,
            alt: String,
          },
        ],
      },
    ],
    // --------------------------------

    status: {
      type: String,
      enum: ["draft", "active", "out_of_stock"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);