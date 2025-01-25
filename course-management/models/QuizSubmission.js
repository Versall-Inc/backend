// models/QuizSubmission.js
const mongoose = require("mongoose");

// For each question answer
const userAnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true }, // reference to the question in the course schema
  selectedAnswer: { type: Number }, // index of the option or 0/1 for T/F
  correct: { type: Boolean, default: false },
  pointsEarned: { type: Number, default: 0 },
});

const quizSubmissionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  unitId: { type: mongoose.Schema.Types.ObjectId, required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, required: true }, // reference to unit.quiz._id
  attemptNumber: { type: Number, default: 1 },
  answers: [userAnswerSchema],
  totalScore: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["in_progress", "submitted", "graded"],
    default: "in_progress",
  },
  submittedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QuizSubmission", quizSubmissionSchema);
