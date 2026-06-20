import express from "express";

// Controllers
import {
  addToCart,
  getCart,
  increaseCartQuantity,
  decreaseCartQuantity,
  removeFromCart,
  createOrderController,
  verifyOrderController,
  createDirectOrderController,
} from "../controller/cart.controller.js";

// Validators
import {
  addToCartValidator,
  increaseCartValidator,
  decreaseCartValidator,
  removeCartItemValidator,
} from "../validator/cart.validator.js";

// Auth middleware
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =================================
   🛒 GET CART
================================= */
router.get("/", protect, getCart);

/* =================================
   ➕ ADD TO CART
================================= */
router.post(
  "/add/:productId/:variantId",
  protect,
  addToCartValidator,
  addToCart
);

/* =================================
   🔼 INCREASE QTY
================================= */
router.patch(
  "/increase/:itemId",
  protect,
  increaseCartValidator,
  increaseCartQuantity
);

/* =================================
   🔽 DECREASE QTY
================================= */
router.patch(
  "/decrease/:itemId",
  protect,
  decreaseCartValidator,
  decreaseCartQuantity
);

/* =================================
   🗑 REMOVE ITEM
================================= */
router.delete(
  "/:itemId",
  protect,
  removeCartItemValidator,
  removeFromCart
);

/* =================================
   💳 CREATE RAZORPAY ORDER
================================= */
router.post(
  "/checkout",
  protect,
  createOrderController
);



/* =================================
   ⚡ DIRECT PRODUCT CHECKOUT (BUY NOW)
================================= */
router.post(
  "/checkout/direct",
  protect,
  createDirectOrderController
);

/* =================================
   🔐 VERIFY PAYMENT
================================= */
router.post(
  "/verify-payment",
  protect,
  verifyOrderController
);

export default router;