import API from "../../../auth/services/api"; // your axios instance

// ➤ Create Review (with images support via multipart/form-data)
export const createReviewAPI = async (formData) => {
  return await API.post("/reviews", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ➤ Get Reviews by Product
export const getProductReviewsAPI = async (productId) => {
  return await API.get(`/reviews/${productId}`);
};