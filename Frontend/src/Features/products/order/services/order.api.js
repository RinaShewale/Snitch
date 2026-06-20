import API from "../../../auth/services/api";

/* ======================
   MY ORDERS
====================== */

export const getMyOrdersAPI = () => {
  return API.get("/orders/my-orders");
};

/* ======================
   SINGLE ORDER
====================== */

export const getOrderByIdAPI = (orderId) => {
  return API.get(`/orders/${orderId}`);
};

/* ======================
   ORDER TRACKING
====================== */

export const getOrderTrackingAPI = (
  orderId
) => {
  return API.get(
    `/orders/tracking/${orderId}`
  );
};

/* ======================
   ADMIN ALL ORDERS
====================== */

export const getAllOrdersAPI = () => {
  return API.get("/orders/seller/all");
};

/* ======================
   UPDATE STATUS
====================== */

export const updateOrderStatusAPI = (
  orderId,
  data
) => {
  return API.patch(
    `/orders/seller/${orderId}/status`,
    data
  );
};