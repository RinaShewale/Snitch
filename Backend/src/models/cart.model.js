import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        variant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product.variants'
        },

        // ✅ User ne select keleli values
        selectedAttributes: {
          color: {
            type: String,
            default: null,
          },

          size: {
            type: String,
            default: null,
          },
        },

        quantity: {
          type: Number,
          default: 1,
        },

        price: {
          type: priceSchema,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", cartSchema);