import Cart from "../models/cart.model.js";
import paymentModel from "../models/payment.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import {
  getVariantStock,
  getVariantPrice,
} from "../dao/product.dao.js";
import { getCartWithTotal } from "../dao/cart.dao.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { createOrder } from "../services/payment.service.js";
import { config } from "../config/config.js";


// ======================
// ADD TO CART
// ======================
// ======================
// ADD TO CART
// ======================
export const addToCart = async (req, res) => {
  try {
    const { productId, variantId } = req.params;

    const {
      quantity = 1,
      selectedAttributes = {},
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const stock = await getVariantStock(
      productId,
      variantId
    );

    const price = await getVariantPrice(
      productId,
      variantId
    );

    if (stock < quantity) {
      return res.status(400).json({
        message: "Not enough stock",
      });
    }

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        String(item.variant || "") ===
        String(variantId || "") &&
        item.selectedAttributes?.size ===
        selectedAttributes?.size &&
        item.selectedAttributes?.color ===
        selectedAttributes?.color
    );

    if (existingItem) {
      const newQty =
        existingItem.quantity + quantity;

      if (newQty > stock) {
        return res.status(400).json({
          message: "Stock limit exceeded",
        });
      }

      existingItem.quantity = newQty;
    } else {
      cart.items.push({
        product: productId,
        variant: variantId,

        selectedAttributes: {
          color:
            selectedAttributes?.color ||
            null,

          size:
            selectedAttributes?.size ||
            null,
        },

        quantity,

        price: {
          amount: price.amount,
          currency:
            price.currency || "INR",
        },
      });
    }

    await cart.save();

    const updatedCart =
      await Cart.findById(cart._id)
        .populate("items.product");

    const cartObj =
      updatedCart.toObject();

    cartObj.items = cartObj.items.map(
      (item) => {
        const selectedVariant =
          item.product?.variants?.find(
            (variant) =>
              variant._id.toString() ===
              item.variant?.toString()
          );

        return {
          ...item,
          selectedVariant,
        };
      }
    );

    return res.status(200).json({
      success: true,
      cart: cartObj,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================
// GET CART
// ======================
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await getCartWithTotal(userId);

    // ✅ FIX 1: correct empty handling
    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          items: [],
          totalPrice: 0,
          currency: "INR",
        },
      });
    }

    // ❌ FIX 2: REMOVE WRONG cart[0]
    const cartObj = cart;

    cartObj.items = cartObj.items.map((item) => {
      return {
        ...item,
        selectedVariant: null,
      };
    });

    return res.status(200).json({
      success: true,
      cart: cartObj,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching cart",
      error: error.message,
    });
  }
};




export const increaseCartQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity = 1 } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    item.quantity += quantity;

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate("items.product");

    const cartObj = updatedCart.toObject();

    cartObj.items = cartObj.items.map((item) => {
      const selectedVariant =
        item.product?.variants?.find(
          (variant) =>
            variant._id.toString() ===
            item.variant?.toString()
        );

      return {
        ...item,
        selectedVariant: selectedVariant || null,
      };
    });

    return res.status(200).json({
      success: true,
      cart: cartObj,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error increasing quantity",
      error: error.message,
    });
  }
};



export const decreaseCartQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity = 1 } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    item.quantity -= quantity;

    // 🧠 if qty <= 0 remove item automatically
    if (item.quantity <= 0) {
      item.deleteOne();
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate("items.product");

    const cartObj = updatedCart.toObject();

    cartObj.items = cartObj.items.map((item) => {
      const selectedVariant =
        item.product?.variants?.find(
          (variant) =>
            variant._id.toString() ===
            item.variant?.toString()
        );

      return {
        ...item,
        selectedVariant: selectedVariant || null,
      };
    });

    return res.status(200).json({
      success: true,
      cart: cartObj,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error decreasing quantity",
      error: error.message,
    });
  }
};



export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    item.deleteOne();

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate("items.product");

    const cartObj = updatedCart.toObject();

    cartObj.items = cartObj.items.map((item) => {
      const selectedVariant =
        item.product?.variants?.find(
          (variant) =>
            variant._id.toString() ===
            item.variant?.toString()
        );

      return {
        ...item,
        selectedVariant: selectedVariant || null,
      };
    });

    return res.status(200).json({
      success: true,
      cart: cartObj,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error removing item",
      error: error.message,
    });
  }
};


/* ======================
   CREATE ORDER
====================== */
export const createOrderController = async (req, res) => {
  try {
    const cart = await getCartWithTotal(req.user._id);

    if (!cart?.items?.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // 🔥 SAFE BODY HANDLING (IMPORTANT FIX)
    const body = req.body || {};
    const shippingAddress = body.shippingAddress;

    // 🔥 fallback from user profile (VERY IMPORTANT)
    const user = await User.findById(req.user._id);

    const finalShippingAddress =
      shippingAddress || user?.selectedAddress;

    // 🔥 VALIDATION
    if (
      !finalShippingAddress ||
      !finalShippingAddress.fullName ||
      !finalShippingAddress.phone ||
      !finalShippingAddress.addressLine1 ||
      !finalShippingAddress.city ||
      !finalShippingAddress.state ||
      !finalShippingAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Incomplete shipping address",
      });
    }

    const amount = cart.totalPrice;

    const razorpayOrder = await createOrder({
      amount,
      currency: "INR",
    });

    const payment = await paymentModel.create({
      user: req.user._id,
      razorpay: {
        orderId: razorpayOrder.id,
      },
      amount,
      currency: "INR",
      status: "pending",
      items: cart.items,
      shippingAddress: finalShippingAddress, // ✅ FIXED
    });

    return res.status(200).json({
      success: true,
      order: razorpayOrder,
      payment,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};






export const createDirectOrderController = async (req, res) => {
  try {
    const {
      productId,
      variantId,
      quantity = 1,
      selectedAttributes = {},
      shippingAddress,
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const variant = product.variants.id(variantId);

    // calculate price (variant > product)
    const price = variant?.price?.amount || product.price.amount;

    // Razorpay order create
    const razorpayOrder = await createOrder({
      amount: price * quantity,
      currency: "INR",
    });

    // create payment entry
    const payment = await paymentModel.create({
      user: req.user._id,
      razorpay: {
        orderId: razorpayOrder.id,
      },
      amount: price * quantity,
      currency: "INR",
      status: "pending",
      items: [
        {
          product: productId,
          variant: variantId,
          quantity,
          selectedAttributes,
          price: {
            amount: price,
            currency: "INR",
          },
        },
      ],
      shippingAddress,
    });

    return res.status(200).json({
      success: true,
      order: razorpayOrder,
      payment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const verifyOrderController = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const payment = await paymentModel.findOne({
      "razorpay.orderId": razorpay_order_id,
      status: "pending",
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // ======================
    // VERIFY PAYMENT
    // ======================
    const isValid = validatePaymentVerification(
      {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      },
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET
    );

    if (!isValid) {
      payment.status = "failed";
      await payment.save();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // ======================
    // MARK PAYMENT SUCCESS
    // ======================
    payment.status = "paid";
    payment.razorpay.paymentId = razorpay_payment_id;
    payment.razorpay.signature = razorpay_signature;

    await payment.save();

    // ======================
    // CREATE ORDER
    // ======================
    const order = await Order.create({
      user: payment.user,
      payment: payment._id,
      items: payment.items,
      totalAmount: payment.amount,
      currency: payment.currency,
      status: "confirmed",
      shippingAddress: payment.shippingAddress,
    });

    // ======================
    // REDUCE STOCK
    // ======================
    for (const item of payment.items) {
      if (!item.product) continue;

      await Product.updateOne(
        {
          _id: item.product,
          ...(item.variant && { "variants._id": item.variant }),
        },
        {
          $inc: {
            ...(item.variant
              ? { "variants.$.stock": -item.quantity }
              : { stock: -item.quantity }),
          },
        }
      );
    }

    // ======================
    // CLEAR CART ONLY IF CART CHECKOUT
    // ======================
    // direct checkout items are NOT cart based
    const isCartOrder = payment.items.length > 1;

    if (isCartOrder) {
      await Cart.findOneAndUpdate(
        { user: payment.user },
        { $set: { items: [] } }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      orderId: order._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};