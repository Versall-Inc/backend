// models/Assignment.js
const mongoose = require("mongoose");

const options = { discriminatorKey: "assignmentType", timestamps: true };

const assignmentSchema = new mongoose.Schema(
  {
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
    overview: { type: String },
    dueDate: { type: Date },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
  },
  options
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

// Writing Assignment
const writingAssignmentSchema = new mongoose.Schema({
  wordCount: { type: Number, required: true, min: 100 },
});

Assignment.discriminator("writing", writingAssignmentSchema);

// Presentation Assignment
const presentationAssignmentSchema = new mongoose.Schema({
  slides: { type: Number, required: true, min: 5 },
  duration: { type: Number, required: true, min: 5 }, // in minutes
});

Assignment.discriminator("presentation", presentationAssignmentSchema);

module.exports = Assignment;
