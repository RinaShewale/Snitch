import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
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
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        price: {
          amount: {
            type: Number,
            required: true,
          },

          currency: {
            type: String,
            default: "INR",
          },
        },
      },
    ],

    /* ======================
       SHIPPING ADDRESS
    ====================== */

    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      addressLine1: {
        type: String,
        required: true,
      },

      addressLine2: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      postalCode: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        default: "India",
      },
    },

    /* ======================
       PAYMENT INFO
    ====================== */

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    /* ======================
       ORDER STATUS
    ====================== */

    status: {
      type: String,
      enum: [
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "confirmed",
      index: true,
    },

    /* ======================
       SHIPPING DETAILS
    ====================== */

    courierPartner: {
      type: String,
      default: "",
    },

    trackingNumber: {
      type: String,
      default: "",
    },

    estimatedDeliveryDate: {
      type: Date,
    },

    /* ======================
       TRACKING HISTORY
    ====================== */

    trackingHistory: {
      type: [
        {
          status: {
            type: String,
            enum: [
              "confirmed",
              "processing",
              "shipped",
              "delivered",
              "cancelled",
            ],
            required: true,
          },

          note: {
            type: String,
            default: "",
          },

          updatedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Order",
  orderSchema
);