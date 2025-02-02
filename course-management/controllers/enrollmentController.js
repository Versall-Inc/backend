// controllers/enrollmentController.js
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

exports.enrollUser = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;
  if (!userId || !courseId) {
    return res.status(400).json({ error: "userId and courseId are required." });
  }

  try {
    const course = await Course.findById(courseId).populate("units");
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }
    const existing = await Enrollment.findOne({ userId, course: courseId });
    if (existing) {
      return res.status(400).json({ error: "User already enrolled." });
    }

    const enrollment = new Enrollment({ userId, course: courseId });
    // Initialize progress tracking
    enrollment.progress.unitsProgress = [];
    for (const unit of course.units) {
      const unitProgress = {
        unit: unit._id,
        completed: false,
        chaptersProgress: unit.chapters.map((chapter) => ({
          chapter: chapter._id,
          completed: false,
        })),
        assignmentProgress: {
          assignment: unit.assignment,
          submitted: false,
          submissionDate: null,
          grad: null,
          feedback: null,
        },
        quizProgress: {
          quiz: unit.quiz,
          completed: false,
          score: null,
          attempts: 0,
          lastAttempted: null,
        },
      };

      enrollment.progress.unitsProgress.push(unitProgress);
    }

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

exports.unEnrollUser = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;
  if (!userId || !courseId) {
    return res.status(400).json({ error: "userId and courseId are required." });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(400).json({ error: "User not enrolled." });
    }
    await enrollment.remove();

    course.participants.pull(userId);
    await course.save();

    return res
      .status(200)
      .json({ message: "Unenrolled successfully.", enrollment });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
