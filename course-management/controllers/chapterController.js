// controllers/chapterController.js
const Enrollment = require("../models/Enrollment");

/**
 * Controller to toggle chapter completion status
 */
exports.toggleChapterComplete = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, chapterId } = req.params;
    // check enrollment
    const courseProgress = await Enrollment.findOne({
      course: courseId,
      userId: userId,
    })
      .populate({
        path: "progress.unitsProgress.chaptersProgress",
      })
      .populate({
        path: "progress.unitsProgress.assignmentProgress",
      })
      .populate({
        path: "progress.unitsProgress.quizProgress",
      });
    if (!courseProgress) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    let changed = false;
    courseProgress.progress.unitsProgress.forEach((unitProgress) => {
      unitProgress.chaptersProgress.forEach((chapterProgress) => {
        if (chapterProgress.chapter.toString() === chapterId) {
          chapterProgress.completed = !chapterProgress.completed;
          changed = true;
        }
      });
    });
    if (!changed) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    await courseProgress.save();
    return res.json(courseProgress);
  } catch (error) {
    console.error("Error in chapter toggle:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
