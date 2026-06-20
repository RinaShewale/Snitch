import { useEffect } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchOrders,
  fetchOrderDetails,
  fetchOrderTracking,
} from "../redux/order.slice";

export const useOrder = (
  orderId = null
) => {
  const dispatch = useDispatch();

  const {
    orders,
    currentOrder,
    tracking,
    loading,
    error,
  } = useSelector(
    (state) => state.orders
  );

  /* ======================
     FETCH ALL ORDERS
  ====================== */

  const getOrders = () => {
    dispatch(fetchOrders());
  };

  /* ======================
     FETCH SINGLE ORDER
  ====================== */

  const getOrderDetails = (
    id
  ) => {
    dispatch(
      fetchOrderDetails(id)
    );
  };

  /* ======================
     FETCH TRACKING
  ====================== */

  const getOrderTracking =
    (id) => {
      dispatch(
        fetchOrderTracking(id)
      );
    };

  /* ======================
     AUTO LOAD MY ORDERS
  ====================== */

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  /* ======================
     AUTO LOAD DETAILS
  ====================== */

  useEffect(() => {
    if (orderId) {
      dispatch(
        fetchOrderDetails(
          orderId
        )
      );
    }
  }, [dispatch, orderId]);

  return {
    orders,
    currentOrder,
    tracking,

    loading,
    error,

    getOrders,
    getOrderDetails,
    getOrderTracking,
  };
};