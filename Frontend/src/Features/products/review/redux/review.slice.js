import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createReviewAPI,
  getProductReviewsAPI,
} from "../services/review.api";

// ➤ FETCH REVIEWS
export const fetchReviews = createAsyncThunk(
  "reviews/fetch",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await getProductReviewsAPI(productId);
      return res.data.reviews;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);

// ➤ ADD REVIEW
export const addReview = createAsyncThunk(
  "reviews/add",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await createReviewAPI(formData);
      return res.data.review;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add review"
      );
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearReviews: (state) => {
      state.items = [];
      state.error = null;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // ➤ FETCH
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➤ ADD
      .addCase(addReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;