import Order from "../models/order.model.js";
import { sendOrderStatusEmail } from "../services/orderMail.service.js";

/* ======================
   GET MY ORDERS
====================== */
export const getMyOrders = async (
  req,
  res
) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================
   GET SINGLE ORDER
====================== */
export const getOrderById =
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.orderId
        )
          .populate(
            "user",
            "fullName email"
          )
          .populate("payment")
          .populate({
            path: "items.product",
            select:
              "title images price",
          });

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found",
        });
      }

      if (
        !req.user.isSeller &&
        order.user._id.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }

      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/* ======================
   GET ALL ORDERS
====================== */
export const getAllOrders =
  async (req, res) => {
    try {
      const orders =
        await Order.find()
          .populate(
            "user",
            "fullName email"
          )
          .populate(
            "items.product"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/* ======================
   UPDATE ORDER STATUS
====================== */
export const updateOrderStatus =
  async (req, res) => {
    try {
      const {
        status,
        note,
        trackingNumber,
        courierPartner,
        estimatedDeliveryDate,
      } = req.body;

      const order =
        await Order.findById(
          req.params.orderId
        ).populate(
          "user",
          "fullName email"
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found",
        });
      }

      const allowedStatuses = [
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];

      if (
        status &&
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status",
        });
      }

      const previousStatus =
        order.status;

      /* ======================
         UPDATE FIELDS
      ====================== */

      if (status) {
        order.status = status;
      }

      if (trackingNumber) {
        order.trackingNumber =
          trackingNumber;
      }

      if (courierPartner) {
        order.courierPartner =
          courierPartner;
      }

      if (
        estimatedDeliveryDate
      ) {
        order.estimatedDeliveryDate =
          estimatedDeliveryDate;
      }

      /* ======================
         TRACKING HISTORY
      ====================== */

      if (
        status &&
        previousStatus !== status
      ) {
        order.trackingHistory.push({
          status,
          note:
            note ||
            `Order status updated to ${status}`,
        });
      }

      await order.save();

      /* ======================
         EMAIL NOTIFICATION
      ====================== */

      if (
        status &&
        previousStatus !== status &&
        order.user?.email
      ) {
        try {
          await sendOrderStatusEmail(
            {
              email:
                order.user.email,
              name:
                order.user
                  .fullName,
              orderId:
                order._id
                  .toString()
                  .slice(-8)
                  .toUpperCase(),
              status,
              trackingNumber:
                order.trackingNumber,
              courierPartner:
                order.courierPartner,
              estimatedDeliveryDate:
                order.estimatedDeliveryDate,
            }
          );
        } catch (mailError) {
          console.log(
            "Email Error:",
            mailError.message
          );
        }
      }

      return res.status(200).json({
        success: true,
        message:
          "Order updated successfully",
        order,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/* ======================
   GET ORDER TRACKING
====================== */
export const getOrderTracking =
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.orderId
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found",
        });
      }

      if (
        !req.user.isSeller &&
        order.user.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }

      return res.status(200).json({
        success: true,
        currentStatus:
          order.status,
        trackingNumber:
          order.trackingNumber,
        courierPartner:
          order.courierPartner,
        estimatedDeliveryDate:
          order.estimatedDeliveryDate,
        trackingHistory:
          order.trackingHistory,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };