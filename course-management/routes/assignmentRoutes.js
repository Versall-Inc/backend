// routes/assignmentRoutes.js
const express = require("express");
const router = express.Router();
const assignmentSubmissionController = require("../controllers/assignmentSubmissionController");
const assignmentController = require("../controllers/assignmentController");
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

router.get("/get/:courseId", assignmentController.getAssignments);

router.get(
  "/get/:courseId/:assignmentId",
  assignmentController.getAssignmentById
);

// POST assignment submission
router.post("/submit/:courseId/:assignmentId", selectMulter, assignmentSubmissionController.submitAssignment);

module.exports = router;
