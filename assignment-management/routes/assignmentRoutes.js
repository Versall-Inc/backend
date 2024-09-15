// routes/assignmentRoutes.js
const express = require("express");
const router = express.Router();
const {
  createAssignment,
  getAssignmentsByCourse,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentController");

router.post("/assignments", createAssignment);
router.get("/assignments/course/:courseId", getAssignmentsByCourse);
router.put("/assignments/:id", updateAssignment);
router.delete("/assignments/:id", deleteAssignment);

module.exports = router;
