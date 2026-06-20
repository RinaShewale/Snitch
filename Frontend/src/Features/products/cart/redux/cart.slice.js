import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addToCartAPI,
  getCartAPI,
  increaseCartAPI,
  decreaseCartAPI,
  removeCartItemAPI,
} from "../services/cart.api";

/* ======================
   HELPERS
====================== */
const calculateLocalTotal = (items) => {
  return items.reduce((acc, item) => {
    const price =
      item.price?.amount ||
      item.selectedVariant?.price?.amount ||
      0;

    return acc + price * (item.quantity || 1);
  }, 0);
};

/* ======================
   THUNKS
====================== */
export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const res = await getCartAPI();
  return res.data.cart;
});

export const addToCart = createAsyncThunk("cart/add", async (data) => {
  const res = await addToCartAPI(
    data.productId,
    data.variantId,
    data.quantity,
    data.selectedAttributes
  );
  return res.data.cart;
});

export const increaseCart = createAsyncThunk("cart/increase", async (data) => {
  const res = await increaseCartAPI(data.itemId, data.quantity);
  return res.data.cart;
});

export const decreaseCart = createAsyncThunk("cart/decrease", async (data) => {
  const res = await decreaseCartAPI(data.itemId, data.quantity);
  return res.data.cart;
});

export const removeFromCart = createAsyncThunk("cart/remove", async (itemId) => {
  const res = await removeCartItemAPI(itemId);
  return res.data.cart;
});

/* ======================
   SLICE
====================== */
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalPrice: 0,
    currency: "INR",
    loading: false,
    error: null,
  },

  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    },
  },

  extraReducers: (builder) => {
    builder
      /* LOADING */
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )

      /* SUCCESS */
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.loading = false;

          if (action.payload?.items) {
            state.items = action.payload.items;
          }

          state.totalPrice =
            action.payload?.totalPrice ??
            action.payload?.totalAmount ??
            calculateLocalTotal(state.items);

          state.currency = action.payload?.currency || "INR";
        }
      )

      /* ERROR */
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;