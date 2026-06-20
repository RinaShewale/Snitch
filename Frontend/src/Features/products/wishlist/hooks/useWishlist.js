import { useDispatch, useSelector } from "react-redux";
import { getWishlist, toggleWishlist as toggleAction } from "../redux/wishlist.slice";
import { useCallback } from "react";

export const useWishlist = () => {
  const dispatch = useDispatch();
  
  // Access the state safely
  const { items = [], loading = false } = useSelector((state) => state.wishlist || {});

  const fetchWishlist = useCallback(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleToggle = useCallback(async (productId) => {
    // 1. Perform the toggle
    await dispatch(toggleAction(productId));
    // 2. IMMEDIATELY fetch the full wishlist again to get populated product data
    // This ensures the Wishlist Page has the images/titles ready
    dispatch(getWishlist());
  }, [dispatch]);

  // Use string comparison to be safe
  const isInWishlist = (productId) => {
    return items.some((item) => String(item._id) === String(productId));
  };

  return {
    wishlistItems: items,
    loading,
    toggleWishlist: handleToggle,
    fetchWishlist,
    isInWishlist,
  };
};