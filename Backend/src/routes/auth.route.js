import { Router } from "express";
import passport from "../config/passport.js";

import {
  registerUser,
  loginUser,
  googleCallback,
  getProfile,
  logoutUser,
  forgotPassword,
  resetPassword,
  addAddress, // ⭐ NEW ADD
} from "../controller/auth.controller.js";

import {
  registerValidator,
  loginValidator,
  validateRequest,
} from "../validator/auth.validator.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

/* ======================
   AUTH ROUTES
====================== */
router.post("/register", registerValidator, validateRequest, registerUser);
router.post("/login", loginValidator, validateRequest, loginUser);

/* ======================
   GOOGLE AUTH
====================== */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login?error=oauth_failed",
  }),
  googleCallback
);

/* ======================
   USER PROFILE
====================== */
router.get("/profile", protect, getProfile);
router.post("/logout", logoutUser);

/* ======================
   PASSWORD
====================== */
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

/* ======================
   ⭐ ADDRESS ROUTES (FIX)
====================== */

// add address
router.post("/address", protect, addAddress);

// optional: get saved addresses
router.get("/address", protect, async (req, res) => {
  return res.json({
    success: true,
    addresses: req.user.addresses || [],
    selectedAddress: req.user.selectedAddress || null,
  });
});

export default router;