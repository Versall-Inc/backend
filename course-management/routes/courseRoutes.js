// routes/courseRoutes.js
const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const validate = require("../middlewares/validate");
const { createCourseSchema } = require("../validations/courseSchemas");

// CREATE
router.post("/", validate(createCourseSchema), courseController.createCourse);

// READ (with archive check)
router.get(
  "/:courseId",
  courseController.checkArchiveExpiration,
  courseController.getCourse
);

// DELETE
router.delete(
  "/:courseId",
  courseController.checkArchiveExpiration,
  courseController.deleteCourse
);

// ARCHIVE
router.put(
  "/:courseId/archive",
  courseController.checkArchiveExpiration,
  courseController.archiveCourse
);

// PUSH
router.put(
  "/:courseId/push-deadline",
  courseController.checkArchiveExpiration,
  courseController.pushDeadline
);

module.exports = router;
