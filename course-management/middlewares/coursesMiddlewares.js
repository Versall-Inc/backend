const mongoose = require("mongoose");
const Course = require("../models/Course");
const { deleteCourseCascade } = require("../services/courseService");

/**
 * Middleware to check if a course's archive has expired and perform deletion if necessary.
 */
const checkArchiveExpiration = async (req, res, next) => {
  const { courseId } = req.params;
  if (!courseId) return next();

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ error: "Invalid course ID." });
  }

  try {
    const course = await Course.findById(courseId)
      .populate("units")
      .populate("participants");
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    // Assuming 'isArchiveExpired' is a method defined in the Course model
    if (course.isArchiveExpired()) {
      await deleteCourseCascade(courseId);
      return res
        .status(410)
        .json({ message: "Course was expired and has been deleted." });
    }

    req.course = course;
    next();
  } catch (error) {
    console.error("Error in checkArchiveExpiration middleware:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.checkArchiveExpiration = checkArchiveExpiration;
