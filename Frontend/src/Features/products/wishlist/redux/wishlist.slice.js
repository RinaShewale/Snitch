import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWishlistApi, toggleWishlistApi, clearWishlistApi } from "../services/wishlist.api";

// Thunks
export const getWishlist = createAsyncThunk(
  "wishlist/get",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchWishlistApi();
      return data.wishlist.products; // Returns the array of populated products
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to fetch wishlist");
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await toggleWishlistApi(productId);
      return { productId, wishlist: data.wishlist }; 
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to update wishlist");
    }
  }
);

export const clearWishlist = createAsyncThunk(
  "wishlist/clear",
  async (_, { rejectWithValue }) => {
    try {
      await clearWishlistApi();
      return [];
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to clear wishlist");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Wishlist
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Wishlist
      // Note: Because toggle returns the updated ID list, we usually re-fetch 
      // or update local state. For UI snappiness, we update the items array.
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.loading = false;
        // In a real scenario, after toggling, you might want to re-fetch 
        // to get the full product details, or handle removal locally:
        const exists = state.items.find(item => item._id === action.meta.arg);
        if (exists) {
            state.items = state.items.filter(item => item._id !== action.meta.arg);
        }
        // Note: If adding, you'd usually wait for the populated data 
        // Or call getWishlist() again in the component.
      })
      // Clear Wishlist
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default wishlistSlice.reducer;