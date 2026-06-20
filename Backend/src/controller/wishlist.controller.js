import Wishlist from "../models/wishlist.model.js";
import Product from "../models/product.model.js";

// ======================
// TOGGLE WISHLIST (Add/Remove)
// ======================
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      // Create new wishlist if doesn't exist
      wishlist = await Wishlist.create({
        user: userId,
        products: [productId],
      });
      return res.status(201).json({
        success: true,
        message: "Added to wishlist",
        wishlist,
      });
    }

    const isAdded = wishlist.products.includes(productId);

    if (isAdded) {
      // Remove if already exists (Toggle behavior)
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId
      );
      await wishlist.save();
      return res.status(200).json({
        success: true,
        message: "Removed from wishlist",
        wishlist,
      });
    } else {
      // Add if not exists
      wishlist.products.push(productId);
      await wishlist.save();
      return res.status(200).json({
        success: true,
        message: "Added to wishlist",
        wishlist,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================
// GET WISHLIST
// ======================
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: "products",
      select: "name price images description variants", // adjust fields as needed
    });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        wishlist: { products: [] },
      });
    }

    return res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching wishlist",
      error: error.message,
    });
  }
};

// ======================
// CLEAR WISHLIST
// ======================
export const clearWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $set: { products: [] } }
    );

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error clearing wishlist",
      error: error.message,
    });
  }
};