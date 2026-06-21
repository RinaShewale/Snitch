import API from "../../../auth/services/api"; // your axios instance

// ➤ Create Review
export const createReviewAPI = async (data) => {
  return await API.post("/reviews", data);
};

// ➤ Get Reviews by Product
export const getProductReviewsAPI = async (productId) => {
  return await API.get(`/reviews/${productId}`);
};