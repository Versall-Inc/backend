// models/Unit.js
const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },
    chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  },
  { timestamps: true }
);

// Virtual to get total chapters
unitSchema.virtual("totalChapters").get(function () {
  return this.chapters.length;
});

// Ensure virtual fields are serialized
unitSchema.set("toJSON", { virtuals: true });
unitSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Unit", unitSchema);
