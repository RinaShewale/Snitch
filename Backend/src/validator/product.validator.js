import { body, validationResult } from "express-validator";

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
   📦 CREATE PRODUCT VALIDATOR
================================= */
export const createProductValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .notEmpty()
    .withMessage("Description is required"),

  body("priceAmount")
    .isNumeric()
    .withMessage("Price must be a number"),

  body("priceCurrency")
    .notEmpty()
    .withMessage("Currency is required"),

  validateRequest,
];