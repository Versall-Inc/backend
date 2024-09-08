const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
  name: {
    type: String,
    required: true,
  },
});

const Unit = mongoose.model("Unit", unitSchema);

module.exports = Unit;
