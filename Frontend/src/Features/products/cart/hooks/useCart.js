import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import {
  addToCart,
  fetchCart,
  increaseCart,
  decreaseCart,
  removeFromCart,
  clearCart,
} from "../redux/cart.slice";
import { createOrderAPI, verifyPaymentAPI } from "../services/cart.api";

export const useCart = () => {
  const dispatch = useDispatch();

  const { items, totalPrice, currency, loading, error } = useSelector(
    (state) => state.cart
  );

  /* FETCH CART ON LOAD */
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  /* ACTIONS */
  const addItemToCart = (
    productId,
    variantId,
    quantity = 1,
    selectedAttributes = {}
  ) => {
    dispatch(
      addToCart({
        productId,
        variantId,
        quantity,
        selectedAttributes,
      })
    );
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
     💳 CREATE ORDER (Razorpay)
  ====================== */
  const handleCreateCartOrder = async () => {
    try {
      setPaymentLoading(true);

      const res = await createOrderAPI();

      // backend should return Razorpay order
      return res.data; 
    } catch (err) {
      console.error("Order creation failed:", err);
      throw err;
    } finally {
      setPaymentLoading(false);
    }
  };

  /* ======================
     ✅ VERIFY PAYMENT
  ====================== */
  const handleVerifyPayment = async (paymentData) => {
    try {
      setPaymentLoading(true);

      const res = await verifyPaymentAPI(paymentData);

      // optional: refresh cart after success
      dispatch(fetchCart());

      return res.data;
    } catch (err) {
      console.error("Payment verification failed:", err);
      throw err;
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

    addItemToCart,
    increaseQty,
    decreaseQty,
    removeItem,
    clear,
    handleCreateCartOrder,
    handleVerifyPayment,
  };
};