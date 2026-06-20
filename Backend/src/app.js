// Backend/src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import wishlistRoute from "./routes/wishlist.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ======================
// MIDDLEWARES
// ======================
app.use(cors({
  origin: [
    "https://snitch-fwb7.onrender.com",
    "http://localhost:5173",
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(passport.initialize());

// ======================
// ROUTES
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoute);

// ======================
// HEALTH CHECK
// ======================
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ======================
// FRONTEND SERVE (FIXED)
// ======================

const distPath = path.join(__dirname, "../../Frontend/dist");

app.use(express.static(distPath));

// ✅ IMPORTANT FIX HERE
app.get("*name", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ======================
export default app;