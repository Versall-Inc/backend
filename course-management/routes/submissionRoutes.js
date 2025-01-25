// routes/submissionRoutes.js
const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const validate = require("../middlewares/validate");
const {
  assignmentSubmissionSchema,
} = require("../validations/submissionSchemas");
const {
  uploadWriting,
  uploadPresentation,
} = require("../middlewares/fileUpload");

// Decide which Multer to use based on ?category=writing or ?category=presentation
function selectMulter(req, res, next) {
  const cat = req.query.category || "writing";
  if (cat === "presentation") {
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

router.post(
  "/assignment",
  validate(assignmentSubmissionSchema),
  selectMulter,
  submissionController.handleAssignmentSubmission
);

module.exports = router;
