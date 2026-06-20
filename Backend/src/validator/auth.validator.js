import { body, validationResult } from "express-validator";

// VALIDATE REQUEST
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

// REGISTER VALIDATION
export const registerValidator = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required ❌")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required ❌")
    .isEmail()
    .withMessage("Enter a valid email"),

  body("contact")
    .notEmpty()
    .withMessage("Contact is required ❌")
    .matches(/^[0-9]{10}$/)
    .withMessage("Contact must be exactly 10 digits"),

  body("password")
    .notEmpty()
    .withMessage("Password is required ❌")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["buyer", "seller"])
    .withMessage("Role must be buyer or seller"),
];

// LOGIN VALIDATION
export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required ❌")
    .isEmail()
    .withMessage("Enter a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required ❌"),
];


