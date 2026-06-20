import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import {
  addToCart,
  fetchCart,
  increaseCart,
  decreaseCart,
  removeFromCart,
  clearCart,
} from "../redux/cart.slice";

import {
  createOrderAPI,
  verifyPaymentAPI,
  createDirectOrderAPI,
} from "../services/cart.api";

export const useCart = () => {
  const dispatch = useDispatch();

  const { items, totalPrice, currency, loading, error } = useSelector(
    (state) => state.cart
  );

  const [paymentLoading, setPaymentLoading] = useState(false);

  /* ======================
     LOAD CART
  ====================== */
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  /* ======================
     CART ACTIONS
  ====================== */
  const addItemToCart = (productId, variantId, quantity = 1, selectedAttributes = {}) => {
    dispatch(addToCart({ productId, variantId, quantity, selectedAttributes }));
  };

  const increaseQty = (itemId, quantity = 1) => {
    dispatch(increaseCart({ itemId, quantity }));
  };

  const decreaseQty = (itemId, quantity = 1) => {
    dispatch(decreaseCart({ itemId, quantity }));
  };

  const removeItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const clear = () => {
    dispatch(clearCart());
  };

  /* ======================
     CART CHECKOUT
  ====================== */
  const handleCreateCartOrder = async (shippingAddress) => {
    try {
      setPaymentLoading(true);
      const res = await createOrderAPI(shippingAddress);
      return res.data;
    } finally {
      setPaymentLoading(false);
    }
  };

  /* ======================
     DIRECT PRODUCT CHECKOUT
  ====================== */
  const handleDirectCheckout = async (data) => {
    try {
      setPaymentLoading(true);
      const res = await createDirectOrderAPI(data);
      return res.data;
    } finally {
      setPaymentLoading(false);
    }
  };

  /* ======================
     VERIFY PAYMENT
  ====================== */
  const handleVerifyPayment = async (paymentData) => {
    try {
      setPaymentLoading(true);
      const res = await verifyPaymentAPI(paymentData);
      dispatch(fetchCart());
      return res.data;
    } finally {
      setPaymentLoading(false);
    }
  };

  return {
    items,
    totalPrice,
    currency,
    loading,
    error,
    paymentLoading,

    addItemToCart,
    increaseQty,
    decreaseQty,
    removeItem,
    clear,

    handleCreateCartOrder,
    handleDirectCheckout,
    handleVerifyPayment,
  };
};