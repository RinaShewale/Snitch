import express from "express";
import { 
  toggleWishlist, 
  getWishlist, 
  clearWishlist 
} from "../controller/wishlist.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; // Replace with your auth middleware

const router = express.Router();

router.get("/", protect, getWishlist);
router.post("/toggle/:productId", protect, toggleWishlist);
router.delete("/clear", protect, clearWishlist);

export default router;