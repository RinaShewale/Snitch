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

  // ➤ Submit review
  const submitReview = async ({ productId, rating, comment, images }) => {
    try {
      const formData = new FormData();

      formData.append("productId", productId);
      formData.append("rating", rating);
      formData.append("comment", comment);

      if (images?.length) {
        images.forEach((file) => {
          formData.append("images", file);
        });
      }

      const res = await dispatch(addReview(formData));

      if (addReview.fulfilled.match(res)) {
        return res.payload;
      }

      throw new Error("Review failed");
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