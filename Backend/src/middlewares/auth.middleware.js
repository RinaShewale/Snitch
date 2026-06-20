import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    console.log("COOKIE TOKEN:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token ❌",
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found ❌",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalid ❌",
    });
  }
};
export const isSeller = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized ❌",
      });
    }

    if (req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Seller only access ❌",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};