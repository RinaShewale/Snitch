import dotenv from "dotenv";

dotenv.config();

// ❌ Validate required env variables
if (!process.env.MONGO_URL) {
  throw new Error("❌ MONGO_URL is missing");
}

if (!process.env.JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is missing");
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("❌ GOOGLE_CLIENT_ID is missing");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("❌ GOOGLE_CLIENT_SECRET is missing");
}

if (!process.env.GOOGLE_CALLBACK_URL) {
  throw new Error("❌ GOOGLE_CALLBACK_URL is missing");
}

if (!process.env.EMAIL_USER) {
  throw new Error("❌ EMAIL_USER is missing");
}

if (!process.env.EMAIL_PASS) {
  throw new Error("❌ EMAIL_PASS is missing");
}

// ✅ ImageKit validation (FIXED)
if (!process.env.IMAGEKIT_PUBLIC_KEY) {
  throw new Error("❌ IMAGEKIT_PUBLIC_KEY is missing");
}

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  throw new Error("❌ IMAGEKIT_PRIVATE_KEY is missing");
}

if (!process.env.IMAGEKIT_URL_ENDPOINT) {
  throw new Error("❌ IMAGEKIT_URL_ENDPOINT is missing");
}


if (!process.env.RAZORPAY_KEY_ID) {
  throw new Error("❌ RAZORPAY_KEY_ID is missing");
}

if (!process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("❌ RAZORPAY_KEY_SECRET  is missing");
}

export const config = {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || "development",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,

  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,

  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,


  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
};