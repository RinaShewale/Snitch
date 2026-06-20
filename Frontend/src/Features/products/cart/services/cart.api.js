import API from "../../../auth/services/api";

/* ======================
   ADD TO CART
====================== */
export const addToCartAPI = (
  productId,
  variantId,
  quantity = 1,
  selectedAttributes = {}
) => {
  return API.post(
    `/cart/add/${productId}/${variantId}`,
    {
      quantity,
      selectedAttributes,
    }
  );
};

/* ======================
   GET CART
====================== */
export const getCartAPI = () => {
  return API.get("/cart");
};

/* ======================
   INCREASE QTY
====================== */
export const increaseCartAPI = (itemId, quantity = 1) => {
  return API.patch(`/cart/increase/${itemId}`, {
    quantity,
  });
};

/* ======================
   DECREASE QTY
====================== */
export const decreaseCartAPI = (itemId, quantity = 1) => {
  return API.patch(`/cart/decrease/${itemId}`, {
    quantity,
  });
};

/* ======================
   REMOVE ITEM
====================== */
export const removeCartItemAPI = (itemId) => {
  return API.delete(`/cart/${itemId}`);
};




export const createOrderAPI = (shippingAddress) => {
  return API.post("/cart/checkout", {
    shippingAddress,
  });
};


export const verifyPaymentAPI = (data) => {
  return API.post("/cart/verify-payment", data);
};