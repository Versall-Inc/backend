// models/Chapter.js
const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
    youtubeQuery: { type: String, trim: true },
    youtubeLink: {
      type: String,
      trim: true,
      match: [
        /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
        "Please enter a valid YouTube URL",
      ],
    },
    content: { type: String },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index on deleted for soft delete queries
chapterSchema.index({ deleted: 1 });

// Soft Delete Middleware (optional)
chapterSchema.pre("find", function (next) {
  this.where({ deleted: false });
  next();
});

chapterSchema.pre("findOne", function (next) {
  this.where({ deleted: false });
  next();
});

// Virtual to link to Unit
chapterSchema.virtual("unitDetails", {
  ref: "Unit",
  localField: "unit",
  foreignField: "_id",
  justOne: true,
});

// Ensure virtual fields are serialized
chapterSchema.set("toJSON", { virtuals: true });
chapterSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Chapter", chapterSchema);
