import Product from "../models/product.model.js";

// STOCK
export const getVariantStock = async (productId, variantId) => {
  const product = await Product.findById(productId);
  if (!product) return 0;

  const variant = product.variants.find(
    (v) => v._id.toString() === variantId
  );

  return variant?.stock || 0;
};

// PRICE (NORMALIZED ALWAYS)
export const getVariantPrice = async (productId, variantId) => {
  const product = await Product.findById(productId);
  if (!product) return { amount: 0, currency: "INR" };

  const variant = product.variants.find(
    (v) => v._id.toString() === variantId
  );

  const price = variant?.price || product.price;

  if (typeof price === "number") {
    return { amount: price, currency: "INR" };
  }

  return {
    amount: price?.amount || 0,
    currency: price?.currency || "INR",
  };
};