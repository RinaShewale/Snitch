import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    razorpay: {
      orderId: {
        type: String,
        required: true,
      },
      paymentId: {
        type: String,
        default: null,
      },
      signature: {
        type: String,
        default: null,
      },
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        variant: {
          type: mongoose.Schema.Types.ObjectId,
        },
        quantity: Number,
        price: {
          amount: Number,
          currency: String,
        },
      },
    ],

    // 🔥 FIX: ADD SHIPPING ADDRESS
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String, default: "" },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "India" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);