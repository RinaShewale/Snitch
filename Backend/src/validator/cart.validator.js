import { body, param, validationResult } from "express-validator";

/* =================================
   🔐 VALIDATION ERROR HANDLER
================================= */
export function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation error ❌",
      errors: errors.array(),
    });
  }

  next();
}

/* =================================
   ➕ ADD TO CART VALIDATOR
================================= */
export const addToCartValidator = [
  param("productId")
    .isMongoId()
    .withMessage("Invalid productId"),

  param("variantId")
    .isMongoId()
    .withMessage("Invalid variantId"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  validateRequest,
];




export const increaseCartValidator = [
  param("itemId")
    .isMongoId()
    .withMessage("Invalid cart itemId"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  validateRequest,
];

/* =================================
   🔽 DECREASE QTY VALIDATOR
================================= */
export const decreaseCartValidator = [
  param("itemId")
    .isMongoId()
    .withMessage("Invalid cart itemId"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  validateRequest,
];

/* =================================
   🗑 REMOVE ITEM VALIDATOR
================================= */
export const removeCartItemValidator = [
  param("itemId")
    .isMongoId()
    .withMessage("Invalid cart itemId"),

  validateRequest,
];