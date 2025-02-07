// models/Question.js
const mongoose = require("mongoose");
const { QUESTION_TYPES } = require("../constants");

const questionSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    type: {
      type: String,
      enum: QUESTION_TYPES,
      required: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 1000,
    },
    options: [
      {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: 200,
      },
    ], // Applicable for multiple_choice and true_false
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed, // Number (index) or Boolean
      required: function () {
        return this.type === "multiple_choice" || this.type === "true_false";
      },
    },
    explanation: { type: String },
    points: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

// Validation for correctAnswer based on question type
questionSchema.pre("validate", function (next) {
  if (this.type === "multiple_choice") {
    if (
      typeof this.correctAnswer !== "number" ||
      this.correctAnswer < 0 ||
      this.correctAnswer >= this.options.length
    ) {
      return next(
        new Error("Invalid correctAnswer index for multiple_choice question.")
      );
    }
  } else if (this.type === "true_false") {
    if (typeof this.correctAnswer !== "boolean") {
      return next(
        new Error("correctAnswer must be a boolean for true_false question.")
      );
    }
  }
  next();
});

// Index on quiz for faster lookups
questionSchema.index({ quiz: 1 });

module.exports = mongoose.model("Question", questionSchema);
