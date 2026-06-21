import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchReviews, addReview, clearReviews } from "../redux/review.slice";

export const useReview = (productId) => {
  const dispatch = useDispatch();

  // ✅ SAFE STATE ACCESS
  const { items = [], loading = false, error = null } = useSelector(
    (state) => state.reviews || {}
  );

  // ➤ Load reviews when productId changes
  useEffect(() => {
    if (!productId) return;

    dispatch(fetchReviews(productId));

    return () => {
      dispatch(clearReviews());
    };
  }, [productId, dispatch]);

  // ➤ Submit review (with proper error handling)
  const submitReview = async (data) => {
    try {
      const res = await dispatch(addReview(data));

      // Redux thunk response unwrap
      if (addReview.fulfilled.match(res)) {
        return res.payload;
      }

      throw new Error("Failed to submit review");
    } catch (err) {
      console.error("Review submit error:", err);
      throw err;
    }
  };

  return {
    reviews: items,
    loading,
    error,
    submitReview,
  };
};