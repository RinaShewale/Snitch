import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createReviewAPI,
  getProductReviewsAPI,
} from "../services/review.api";

// ➤ FETCH REVIEWS
export const fetchReviews = createAsyncThunk(
  "reviews/fetch",
  async (productId) => {
    const res = await getProductReviewsAPI(productId);
    return res.data.reviews;
  }
);

// ➤ ADD REVIEW
export const addReview = createAsyncThunk(
  "reviews/add",
  async (data) => {
    const res = await createReviewAPI(data);
    return res.data.review;
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
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD
      .addCase(addReview.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;