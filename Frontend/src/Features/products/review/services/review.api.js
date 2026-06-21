import API from "../../../auth/services/api";

// ➤ Create Review
export const createReviewAPI = async (formData) => {
  return await API.post("/reviews", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

// ➤ Get Reviews
export const getProductReviewsAPI = async (productId) => {
  return await API.get(`/reviews/${productId}`);
};