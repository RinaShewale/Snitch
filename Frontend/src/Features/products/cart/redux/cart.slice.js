import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addToCartAPI,
  getCartAPI,
  increaseCartAPI,
  decreaseCartAPI,
  removeCartItemAPI,
} from "../services/cart.api";

const calculateLocalTotal = (items) => {
  return items.reduce((acc, item) => {
    const price = item.price?.amount ?? item.selectedVariant?.price?.amount ?? 0;
    return acc + price * (item.quantity || 1);
  }, 0);
};

export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const res = await getCartAPI();
  return res.data.cart;
});

export const addToCart = createAsyncThunk("cart/add", async (data) => {
  const res = await addToCartAPI(data.productId, data.variantId, data.quantity, data.selectedAttributes);
  return res.data.cart;
});

export const increaseCart = createAsyncThunk("cart/inc", async (data) => {
  const res = await increaseCartAPI(data.itemId, data.quantity);
  return res.data.cart;
});

export const decreaseCart = createAsyncThunk("cart/dec", async (data) => {
  const res = await decreaseCartAPI(data.itemId, data.quantity);
  return res.data.cart;
});

export const removeFromCart = createAsyncThunk("cart/remove", async (itemId) => {
  const res = await removeCartItemAPI(itemId);
  return res.data.cart;
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    initialPrices: {}, // <--- NEW: Stores the price when item first loaded
    totalPrice: 0,
    currency: "INR",
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.initialPrices = {}; // Clear prices too
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher((a) => a.type.endsWith("/pending"), (state) => {
        state.loading = true;
      })
      .addMatcher((a) => a.type.endsWith("/fulfilled"), (state, action) => {
        state.loading = false;
        if (action.payload?.items) {
          state.items = action.payload.items;

          // LOGIC TO LOCK INITIAL PRICES
          action.payload.items.forEach((item) => {
            // Only set the initial price if we don't already have one for this ID
            if (!state.initialPrices[item._id]) {
              const price = item.price?.amount || item.price || 0;
              if (price > 0) {
                state.initialPrices[item._id] = price;
              }
            }
          });
        }
        const backendTotal = action.payload?.totalPrice ?? action.payload?.totalAmount;
        state.totalPrice = backendTotal ?? calculateLocalTotal(state.items);
        state.currency = action.payload?.currency || "INR";
      })
      .addMatcher((a) => a.type.endsWith("/rejected"), (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;