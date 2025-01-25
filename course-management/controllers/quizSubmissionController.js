// controllers/quizSubmissionController.js
const QuizSubmission = require("../models/QuizSubmission");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// Evaluate user answers vs the course's quiz questions
async function evaluateQuiz(submission) {
  const course = await Course.findById(submission.courseId);
  if (!course) throw new Error("Course not found.");

  const unit = course.units.id(submission.unitId);
  if (!unit) throw new Error("Unit not found.");

  // We'll assume there's only one quiz in the unit, or we check quizId
  const quiz = unit.quiz;
  if (!quiz) throw new Error("No quiz found in this unit.");

  // Build a map from questionId => question data
  const questionMap = new Map(quiz.questions.map((q) => [q._id.toString(), q]));

  let totalScore = 0;
  submission.answers.forEach((answer) => {
    const q = questionMap.get(answer.questionId.toString());
    if (!q) return;
    if (answer.selectedAnswer === q.correct_answer) {
      answer.correct = true;
      answer.pointsEarned = q.points || 1;
      totalScore += answer.pointsEarned;
    } else {
      answer.correct = false;
      answer.pointsEarned = 0;
    }
  });

  submission.totalScore = totalScore;
  submission.status = "graded";
  submission.submittedAt = new Date();
  await submission.save();
  return submission;
}

exports.submitQuiz = async (req, res) => {
  try {
    // body: { courseId, unitId, quizId, answers: [{ questionId, selectedAnswer }, ...] }
    const { courseId, unitId, quizId, answers } = req.body;
    const userId = req.user.id;

    // Check enrollment
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res
        .status(403)
        .json({ error: "User not enrolled in this course." });
    }

    // Create a new quiz submission (in_progress)
    const submission = new QuizSubmission({
      userId,
      courseId,
      unitId,
      quizId,
      answers: answers || [],
      status: "in_progress",
    });
    await submission.save();

    return res
      .status(201)
      .json({ message: "Quiz submission created. Continue or finalize." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// We finalize the quiz (grade it) in a separate route, or you can do it in one step
exports.finalizeQuiz = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await QuizSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found." });
    }
    if (submission.status === "graded") {
      return res.status(400).json({ error: "Submission already graded." });
    }
    // Evaluate
    const graded = await evaluateQuiz(submission);
    return res.json({ message: "Quiz graded.", graded });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
