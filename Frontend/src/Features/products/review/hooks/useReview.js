import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchReviews, addReview, clearReviews } from "../redux/review.slice";

export const useReview = (productId) => {
  const dispatch = useDispatch();

  const { items = [], loading = false, error = null } = useSelector(
    (state) => state.reviews || {}
  );

  // ➤ Load reviews
  useEffect(() => {
    if (!productId) return;

    dispatch(fetchReviews(productId));

    return () => {
      dispatch(clearReviews());
    };
  }, [productId, dispatch]);

  // ➤ Submit review (FIXED)
  const submitReview = async (formData) => {
    try {
      // ❌ DON'T rebuild FormData again (you already made it)
      const res = await dispatch(addReview(formData));

      if (addReview.fulfilled.match(res)) {
        return res.payload;
      }

      throw new Error(res.payload || "Review failed");
    } catch (err) {
      console.error("Submit Review Error:", err);
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