import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getMyOrdersAPI,
  getOrderByIdAPI,
  getOrderTrackingAPI,
} from "../services/order.api";

/* ======================
   GET MY ORDERS
====================== */

export const fetchOrders =
  createAsyncThunk(
    "orders/fetchOrders",
    async (_, thunkAPI) => {
      try {
        const res =
          await getMyOrdersAPI();

        return res.data.orders;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            error.message
        );
      }
    }
  );

/* ======================
   GET ORDER DETAILS
====================== */

export const fetchOrderDetails =
  createAsyncThunk(
    "orders/fetchOrderDetails",
    async (
      orderId,
      thunkAPI
    ) => {
      try {
        const res =
          await getOrderByIdAPI(
            orderId
          );

        return res.data.order;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            error.message
        );
      }
    }
  );

/* ======================
   GET ORDER TRACKING
====================== */

export const fetchOrderTracking =
  createAsyncThunk(
    "orders/fetchOrderTracking",
    async (
      orderId,
      thunkAPI
    ) => {
      try {
        const res =
          await getOrderTrackingAPI(
            orderId
          );

        return res.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            error.message
        );
      }
    }
  );

const orderSlice = createSlice({
  name: "orders",

  initialState: {
    orders: [],
    currentOrder: null,

    tracking: null,

    loading: false,
    error: null,
  },

  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },

    clearCurrentOrder: (
      state
    ) => {
      state.currentOrder = null;
    },
  },

  extraReducers: (
    builder
  ) => {
    builder

      /* ======================
         FETCH ORDERS
      ====================== */

      .addCase(
        fetchOrders.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchOrders.fulfilled,
        (
          state,
          action
        ) => {
          state.loading = false;
          state.orders =
            action.payload;
        }
      )

      .addCase(
        fetchOrders.rejected,
        (
          state,
          action
        ) => {
          state.loading = false;
          state.error =
            action.payload;
        }
      )

      /* ======================
         FETCH DETAILS
      ====================== */

      .addCase(
        fetchOrderDetails.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchOrderDetails.fulfilled,
        (
          state,
          action
        ) => {
          state.loading = false;
          state.currentOrder =
            action.payload;
        }
      )

      .addCase(
        fetchOrderDetails.rejected,
        (
          state,
          action
        ) => {
          state.loading = false;
          state.error =
            action.payload;
        }
      )

      /* ======================
         FETCH TRACKING
      ====================== */

      .addCase(
        fetchOrderTracking.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchOrderTracking.fulfilled,
        (
          state,
          action
        ) => {
          state.loading = false;
          state.tracking =
            action.payload;
        }
      )

      .addCase(
        fetchOrderTracking.rejected,
        (
          state,
          action
        ) => {
          state.loading = false;
          state.error =
            action.payload;
        }
      );
  },
});

export const {
  clearOrderError,
  clearCurrentOrder,
} = orderSlice.actions;

export default orderSlice.reducer;