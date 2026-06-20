import API from "../../../auth/services/api"; // Importing your existing axios instance

export const fetchWishlistApi = async () => {
  const response = await API.get("/wishlist");
  return response.data;
};

export const toggleWishlistApi = async (productId) => {
  const response = await API.post(`/wishlist/toggle/${productId}`);
  return response.data;
};

export const clearWishlistApi = async () => {
  const response = await API.delete("/wishlist/clear");
  return response.data;
};