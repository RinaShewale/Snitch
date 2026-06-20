import express from "express";

import {
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderTracking,
} from "../controller/order.controller.js";

import {
  protect,
  isSeller,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ======================
   USER ROUTES
====================== */

router.get(
  "/my-orders",
  protect,
  getMyOrders
);

router.get(
  "/tracking/:orderId",
  protect,
  getOrderTracking
);

router.get(
  "/:orderId",
  protect,
  getOrderById
);

/* ======================
   SELLER / ADMIN ROUTES
====================== */

router.get(
  "/seller/all",
  protect,
  isSeller,
  getAllOrders
);

router.patch(
  "/seller/:orderId/status",
  protect,
  isSeller,
  updateOrderStatus
);

export default router;