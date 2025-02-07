// controllers/quizSubmissionController.js
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Quiz = require("../models/Quiz");

exports.submitQuiz = async (req, res) => {
  try {
    // body: { courseId, unitId, quizId, answers: [{ questionId, selectedAnswer }, ...] }
    const { courseId, quizId, answers } = req.body;
    const userId = req.user.id;

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      userId,
      course: courseId,
    }).populate({
      path: "progress.unitsProgress.quizProgress",
    });

    if (!enrollment) {
      return res
        .status(403)
        .json({ error: "User not enrolled in this course." });
    }
    // Check quiz
    const quiz = await Quiz.findById(quizId).populate("questions").lean();
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found." });
    }

    // find the quizProgress and update the score, completed, lastAttempted, and attempts.
    const unitProgress = enrollment.progress.unitsProgress.find(
      (unit) => unit.quizProgress.quiz.toString() === quizId
    );
    if (unitProgress && unitProgress.quizProgress.completed) {
      return res.status(400).json({ error: "Quiz already completed." });
    }
    if (!unitProgress) {
      return res.status(404).json({ error: "Quiz progress not found." });
    }

    // already completed
    let points = 0;
    let correctAnswers = [];
    let totalPoints = 0;

    for (const answer of answers) {
      const question = quiz.questions.find(
        (q) => q._id.toString() === answer.questionId
      );
      if (!question) {
        return res.status(400).json({ error: "Invalid question ID." });
      }
      totalPoints += question.points;
      if (answer.selectedAnswer === question.correctAnswer) {
        points += question.points;
      }
      correctAnswers.push({
        questionId: question._id,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      });
    }

    unitProgress.quizProgress.completed = true;
    unitProgress.quizProgress.lastAttempted = new Date();
    unitProgress.quizProgress.attempts += 1;
    let score = totalPoints == 0 ? 0 : (points / totalPoints) * 100;
    unitProgress.quizProgress.score = score;

    enrollment.calculateOverallProgress();
    // save the enrollment with the new unitProgress
    await enrollment.save();
    return res.json({ score, correctAnswers });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const { courseId, quizId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({
      userId,
      course: courseId,
    }).lean();
    // not enrolled
    if (!enrollment) {
      return res
        .status(403)
        .json({ error: "User not enrolled in this course." });
    }
    const quiz = await Quiz.findById(quizId).populate("questions").lean();
    const unitProgress = enrollment.progress.unitsProgress.find(
      (unit) => unit.quizProgress.quiz.toString() === quizId
    );
    const quizProgress = unitProgress.quizProgress;
    // if quiz not found
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found." });
    }
    // hide correct answers
    quiz.questions.forEach((q) => {
      q.correctAnswer = undefined;
      q.explanation = undefined;
    });
    return res.json({ quiz, quizProgress });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
