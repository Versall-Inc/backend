// middlewares/fileUpload.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      req.user.id + "-" + req.params.courseId + "-" + req.params.assignmentId;
    cb(null, "file-" + uniqueSuffix + path.extname(file.originalname));
  },
});

function fileFilterWritings(req, file, cb) {
  // For demo, allow all. In production, check MIME types.

  cb(null, true);
}

function fileFilterPresentations(req, file, cb) {
  // For demo, allow all. In production, check MIME types.

  cb(null, true);
}

// 2MB for "writing"
const uploadWriting = multer({
  storage,
  fileFilterWritings,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// 10MB for "presentation"
const uploadPresentation = multer({
  storage,
  fileFilterPresentations,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = {
  uploadWriting,
  uploadPresentation,
};
