// middlewares/fileUpload.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "file-" + uniqueSuffix + path.extname(file.originalname));
  },
});

function fileFilter(req, file, cb) {
  // For demo, allow all. In production, check MIME types.
  cb(null, true);
}

// 1MB for "writing"
const uploadWriting = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 },
});

// 10MB for "presentation"
const uploadPresentation = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = {
  uploadWriting,
  uploadPresentation,
};
