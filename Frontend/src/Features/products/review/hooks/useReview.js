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

  // ➤ Submit review (with proper error handling and FormData construction)
  const submitReview = async ({ productId, rating, comment, images }) => {
    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("rating", Number(rating));
      formData.append("comment", comment);

      // Append image files if they exist
      if (images && images.length > 0) {
        images.forEach((file) => {
          formData.append("images", file);
        });
      }

      const res = await dispatch(addReview(formData));

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