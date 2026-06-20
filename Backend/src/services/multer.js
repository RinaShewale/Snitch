import multer from "multer";

// ==========================
// MEMORY STORAGE (GOOD FOR CLOUD)
// ==========================
const storage = multer.memoryStorage();

// ==========================
// IMAGE FILTER (STRICT)
// ==========================
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed ❌"), false);
  }
};

// ==========================
// MULTER CONFIG (FIXED)
// ==========================
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 30,
  },
});