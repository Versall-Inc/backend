const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Unit",
  },
  name: {
    type: String,
    required: true,
  },
  videoQuery: {
    type: String,
    required: true,
  },
});

const Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = Chapter;
