import express from "express";
import {
  createProduct,
  getSellerProducts,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getCategories,
  searchSimilarProducts, // ✅ IMPORT ADDED
} from "../controller/product.controller.js";

import { upload } from "../services/multer.js";
import { protect, isSeller } from "../middlewares/auth.middleware.js";
import { createProductValidator } from "../validator/product.validator.js";

const router = express.Router();


// ================= CREATE PRODUCT =================
router.post(
  "/create",
  protect,
  isSeller,
  upload.fields([
    { name: "productImages", maxCount: 10 },
    { name: "variantImages_0", maxCount: 5 },
    { name: "variantImages_1", maxCount: 5 },
    { name: "variantImages_2", maxCount: 5 },
    { name: "variantImages_3", maxCount: 5 },
    { name: "variantImages_4", maxCount: 5 },
  ]),
  createProductValidator,
  createProduct
);


router.get("/", getAllProducts);

router.get("/categories", getCategories);

router.get("/search/similar", searchSimilarProducts);

router.get(
  "/seller",
  protect,
  isSeller,
  getSellerProducts
);

// dynamic routes LAST
router.get("/:id", getProductById);

// UPDATE PRODUCT
router.put(
  "/:id",
  protect,
  isSeller,
  upload.any(),
  updateProduct
);

// DELETE PRODUCT
router.delete(
  "/:id",
  protect,
  isSeller,
  deleteProduct
);

export default router;