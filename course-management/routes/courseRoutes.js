// routes/courseRoutes.js
const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const validate = require("../middlewares/validate");
const { createCourseSchema } = require("../validations/courseSchemas");
const { checkArchiveExpiration } = require("../middlewares/coursesMiddlewares");

// CREATE
router.post("/", validate(createCourseSchema), courseController.createCourse);

// DELETE
router.delete(
  "/delete/:courseId",
  checkArchiveExpiration,
  courseController.deleteCourse
);

// ARCHIVE
router.put(
  "/update/:courseId/archive",
  checkArchiveExpiration,
  courseController.archiveCourse
);

// PUSH
router.put(
  "/push-deadline/:courseId",
  checkArchiveExpiration,
  courseController.pushDeadline
);

// GET

// READ (with archive check)
router.get(
  "/get/:courseId",
  checkArchiveExpiration,
  courseController.getCourse
);

// get all courses for a user(user is the owner of the course)
router.get("/mine", courseController.getMyCourses);

// get all courses for a user feed(Courses that are enrolled by the user)
router.get("/feed", courseController.getMyEnrolledCourses);

// get recommendations for a user
router.get("/recommendations", courseController.getRecommendations);

// get all courses for a user that are archived
router.get("/get-my-archived", courseController.getMyArchivedCourses);

// get all courses for a user that are completed
router.get("/get-completed", courseController.getMyCompletedCourses);

module.exports = router;
