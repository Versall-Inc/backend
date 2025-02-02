const Enrollment = require("../models/Enrollment");

/**
 * Middleware to check if a course's archive has expired and perform deletion if necessary.
 */
const checkArchiveExpiration = async (req, res, next) => {
  const { courseId } = req.params;
  // from enrolment
  const userId = req.user.id;
  try {
    // isArchived is in enrolment model
    const enrollment = await Enrollment.findOne({ userId, course: courseId });
    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found." });
    }

    if (!enrollment.isArchived) {
      return next();
    }
    // if course is archived, check if it has expired 30 days
    const currentDate = new Date();
    const archiveDate = enrollment.archivedAt;
    const expirationDate = new Date(archiveDate);
    expirationDate.setDate(expirationDate.getDate() + 30);
    if (currentDate < expirationDate) {
      return next();
    }
    // if expired, delete course
    await enrollment.remove();
  } catch (error) {
    console.error("Error in checkArchiveExpiration middleware:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.checkArchiveExpiration = checkArchiveExpiration;
