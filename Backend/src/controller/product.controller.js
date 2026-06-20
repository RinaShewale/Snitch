import Product from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

/* ======================================
   CREATE PRODUCT
====================================== */
export const createProduct = async (req, res) => {
  try {
    let {
      title,
      description,
      priceAmount,
      priceCurrency = "INR",
      variants,
      category,
    } = req.body;

    // SAFE NUMBER CONVERSION
    priceAmount = Number(priceAmount);
    if (isNaN(priceAmount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priceAmount"
      });
    }

    const allowedCurrencies = ["INR", "USD", "EUR"];
    if (!allowedCurrencies.includes(priceCurrency)) {
      return res.status(400).json({
        success: false,
        message: "Invalid currency",
      });
    }

    /* ================= IMAGES ================= */
    const productImages = req.files?.productImages || [];
    if (productImages.length > 10) {
      return res.status(400).json({
        success: false,
        message: "Max 10 product images allowed",
      });
    }

    const images = await Promise.all(
      productImages.map(async (file) => {
        const uploaded = await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
          folder: "products",
        });

        return {
          url: uploaded.url,
          fileId: uploaded.fileId,
          alt: title || "product",
        };
      })
    );

    /* ================= VARIANTS PARSE ================= */
    let variantData = [];
    try {
      variantData = typeof variants === "string" ? JSON.parse(variants) : variants || [];
    } catch (err) {
      variantData = [];
    }

    /* ================= VARIANTS PROCESS ================= */
    const parsedVariants = await Promise.all(
      variantData.map(async (variant, index) => {
        const variantFiles = req.files?.[`variantImages_${index}`] || [];

        if (variantFiles.length > 5) {
          throw new Error("Each variant can have max 5 images");
        }

        const variantImages = await Promise.all(
          variantFiles.map(async (file) => {
            const uploaded = await uploadFile({
              buffer: file.buffer,
              fileName: file.originalname,
              folder: "products/variants",
            });

            return {
              url: uploaded.url,
              fileId: uploaded.fileId,
              alt: variant?.color || variant?.size || title,
            };
          })
        );

        // SAFE VARIANT PRICE
        let variantAmount = Number(variant?.price?.amount);
        if (isNaN(variantAmount)) variantAmount = priceAmount;

        return {
          // Updated fields to match new schema
          size: variant.size || "",
          color: variant.color || "",
          material: variant.material || "",
          
          stock: Number(variant?.stock || 0),
          price: {
            amount: variantAmount,
            currency: variant?.price?.currency || priceCurrency,
          },
          images: variantImages,
        };
      })
    );

    /* ================= CREATE PRODUCT ================= */
    const product = await Product.create({
      title,
      description,
      category,
      seller: req.user._id,
      price: {
        amount: priceAmount,
        currency: priceCurrency,
      },
      images,
      variants: parsedVariants,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================
   GET SELLER PRODUCTS
====================================== */
export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================
   GET SINGLE PRODUCT
====================================== */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "fullName email");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================
   GET ALL PRODUCTS
====================================== */
export const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};

    if (category && category !== "all") {
      filter.category = category.toLowerCase();
    }

    const products = await Product.find(filter)
      .populate("seller", "fullName email")
      .sort({ createdAt: -1 })
      .lean();

    const safeProducts = products.map((p) => ({
      ...p,
      price: {
        amount: Number(p?.price?.amount || 0),
        currency: p?.price?.currency || "INR",
      },
    }));

    return res.status(200).json({
      success: true,
      count: safeProducts.length,
      products: safeProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================
   DELETE PRODUCT
====================================== */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================
   UPDATE PRODUCT
====================================== */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let {
      title,
      description,
      priceAmount,
      priceCurrency,
      category,
      variants,
      images,
    } = req.body;

    if (title) product.title = title;
    if (description) product.description = description;
    if (category) product.category = category;

    /* ================= SAFE PRICE ================= */
    priceAmount = Number(priceAmount);
    if (!isNaN(priceAmount)) {
      product.price.amount = priceAmount;
    }
    if (priceCurrency) {
      product.price.currency = priceCurrency;
    }

    /* ================= IMAGES ================= */
    let updatedImages = [];
    if (images) {
      try {
        const parsed = typeof images === "string" ? JSON.parse(images) : images;
        updatedImages = Array.isArray(parsed) ? parsed : [];
      } catch {
        updatedImages = [];
      }
    } else {
      updatedImages = [...(product.images || [])];
    }

    const productImages = req.files?.productImages || [];
    for (const file of productImages) {
      const uploaded = await uploadFile({
        buffer: file.buffer,
        fileName: file.originalname,
        folder: "products",
      });
      updatedImages.push({
        url: uploaded.url,
        fileId: uploaded.fileId,
        alt: product.title,
      });
    }
    product.images = updatedImages;

    /* ================= VARIANTS ================= */
    if (variants) {
      let variantData = [];
      try {
        variantData = typeof variants === "string" ? JSON.parse(variants) : variants;
      } catch {
        variantData = [];
      }

      const parsedVariants = await Promise.all(
        variantData.map(async (variant, index) => {
          const variantFiles = req.files?.[`variantImages_${index}`] || [];

          let variantImages = Array.isArray(variant.images) ? [...variant.images] : [];

          for (const file of variantFiles) {
            const uploaded = await uploadFile({
              buffer: file.buffer,
              fileName: file.originalname,
              folder: "products/variants",
            });
            variantImages.push({
              url: uploaded.url,
              fileId: uploaded.fileId,
              alt: product.title,
            });
          }

          let variantAmount = Number(variant?.price?.amount);
          if (isNaN(variantAmount)) variantAmount = product.price.amount;

          return {
            _id: variant._id,
            // Updated fields to match new schema
            size: variant.size || "",
            color: variant.color || "",
            material: variant.material || "",
            
            stock: Number(variant?.stock || 0),
            price: {
              amount: variantAmount,
              currency: variant?.price?.currency || product.price.currency,
            },
            images: variantImages,
          };
        })
      );

      product.variants = parsedVariants;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================
   GET ALL CATEGORIES
====================================== */
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $match: { category: { $exists: true, $ne: "" } } },
      {
        $group: {
          _id: "$category",
          image: { $first: { $arrayElemAt: ["$images.url", 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          label: { $toUpper: "$_id" },
          img: "$image",
        },
      },
      { $sort: { id: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================
   SEARCH SIMILAR PRODUCTS
====================================== */
export const searchSimilarProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q?.trim()) {
      return res.status(400).json({ success: false, message: "Query required" });
    }

    const query = q.toLowerCase().trim();
    const words = query.split(/\s+/).filter(Boolean);
    const products = await Product.find({ status: "active" }).lean();

    const scoredProducts = products
      .map((product) => {
        let score = 0;
        const title = product.title?.toLowerCase() || "";
        const category = product.category?.toLowerCase() || "";
        const description = product.description?.toLowerCase() || "";

        words.forEach((word) => {
          if (title === word) score += 100;
          if (title.includes(word)) score += 50;
          if (category.includes(word)) score += 40;
          if (description.includes(word)) score += 15;
        });

        return { ...product, score };
      })
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score);

    return res.status(200).json({
      success: true,
      count: scoredProducts.length,
      products: scoredProducts.slice(0, 20),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};