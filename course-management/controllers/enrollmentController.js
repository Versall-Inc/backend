// controllers/enrollmentController.js
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

exports.enrollUser = async (req, res) => {
  const { userId, courseId } = req.body;
  if (!userId || !courseId) {
    return res.status(400).json({ error: "userId and courseId are required." });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }
    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) {
      return res.status(400).json({ error: "User already enrolled." });
    }
    const enrollment = new Enrollment({ userId, courseId });
    await enrollment.save();

    course.participants.push(userId);
    await course.save();

    return res
      .status(201)
      .json({ message: "Enrolled successfully.", enrollment });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getCourseContent = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res
        .status(403)
        .json({ error: "User is not enrolled in this course." });
    }
    const course = await Course.findById(courseId).select("units push_count");
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }
    return res.json(course);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
