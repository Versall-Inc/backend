// models/Quiz.js
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    dueDate: { type: Date },
    overview: { type: String },
    totalPoints: { type: Number, default: 0, min: 0 },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);

// Unique composite index to prevent duplicate quizzes within a unit
quizSchema.index({ unit: 1, title: 1 }, { unique: true });

// Virtual to get total questions
quizSchema.virtual("totalQuestions").get(function () {
  return this.questions.length;
});

// Ensure virtual fields are serialized
quizSchema.set("toJSON", { virtuals: true });
quizSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Quiz", quizSchema);
