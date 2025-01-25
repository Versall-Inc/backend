// routes/assignmentRoutes.js
const express = require("express");
const router = express.Router();
const assignmentSubmissionController = require("../controllers/assignmentSubmissionController");
const {
  uploadWriting,
  uploadPresentation,
} = require("../middlewares/fileUpload");

// We'll pick which Multer to use based on a query param ?type=writing or ?type=presentation
function selectMulter(req, res, next) {
  const type = req.query.type || "writing";
  if (type === "presentation") {
    uploadPresentation.single("file")(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  } else {
    uploadWriting.single("file")(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  }
}

// POST assignment submission
router.post("/", selectMulter, assignmentSubmissionController.submitAssignment);

module.exports = router;
