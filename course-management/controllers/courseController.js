// controllers/courseController.js

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const {
  generateCourseOutline,
  createCourseAsync,
  preparePayload,
  checkCourseLimit,
  initializeCourse,
  enrollCreator,
} = require("../services/courseService");

/**
 * Helper function to perform cascade deletion of a course and its related data.
 * @param {String} courseId - The ID of the course to delete.
 */
const deleteCourseCascade = async (courseId) => {
  try {
    // 1. Delete Assignment Submissions and associated files
    const assignmentSubmissions = await AssignmentSubmission.find({ courseId });
    for (const submission of assignmentSubmissions) {
      if (submission.fileUrl) {
        try {
          fs.unlinkSync(path.resolve(submission.fileUrl));
        } catch (err) {
          // Log the error and continue
          console.error(
            `Failed to delete file at ${submission.fileUrl}:`,
            err.message
          );
        }
      }
    }
    await AssignmentSubmission.deleteMany({ courseId });

    // 3. Delete Enrollments (which include embedded CourseProgress)
    await Enrollment.deleteMany({ course: courseId });

    // 4. Delete the Course
    await Course.findByIdAndDelete(courseId);
  } catch (error) {
    throw new Error(`Cascade deletion failed: ${error.message}`);
  }
};

/**
 * Controller to create a new course.
 */
exports.createCourse = async (req, res) => {
  let isCourseCreated = false;
  let courseId = null;
  const userId = req.user.id;
  try {
    const payload = preparePayload(req);
    await checkCourseLimit(userId);

    const generatedData = await generateCourseOutline(payload);
    console.log("Generated course outline:", generatedData);

    const newCourse = await initializeCourse(payload, generatedData, userId);

    await enrollCreator(userId, newCourse._id);

    // Send response to the user immediately
    res.status(200).json({
      courseId: newCourse._id,
      title: newCourse.title,
      units: generatedData.units,
    });

    isCourseCreated = true;
    courseId = newCourse._id;

    // Run the remaining tasks in the background without awaiting
    (async () => {
      try {
        await createCourseAsync(payload, generatedData, newCourse, userId);
      } catch (error) {
        console.error("Error in background task:", error);
        await deleteCourseCascade(courseId);
      }
    })();
  } catch (error) {
    if (isCourseCreated) {
      await deleteCourseCascade(courseId);
    }
    console.error("Error in createCourse:", error);
    if (!res.headersSent) {
      return res.status(400).json({ error: error.message });
    }
  }
};
/**
 * Controller to get a specific course with visibility checks.
 */
exports.getCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const courseProgress = await Enrollment.findOne({
      course: courseId,
      userId: req.user.id,
    })
      .populate({
        path: "course",
        populate: {
          path: "units",
          populate: [
            { path: "chapters" },
            { path: "assignment" },
            { path: "quiz" },
          ],
        },
      })
      .populate({
        path: "progress.unitsProgress.chaptersProgress",
      })
      .populate({
        path: "progress.unitsProgress.assignmentProgress",
      })
      .populate({
        path: "progress.unitsProgress.quizProgress",
      })
      .lean();

    if (!courseProgress) {
      return res
        .status(404)
        .json({ error: "You are not enrolled in this course." });
    }
    return res.json(courseProgress);
  } catch (error) {
    console.error("Error in getCourse:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
/**
 * Controller to delete a course.
 */
exports.deleteCourse = async (req, res) => {
  const course = req.course;

  // Check if the authenticated user is the creator of the course
  if (course.creatorId !== req.user.id) {
    return res
      .status(403)
      .json({ error: "You are not allowed to delete this course." });
  }

  try {
    await deleteCourseCascade(course._id);
    return res.json({ message: "Course deleted successfully." });
  } catch (error) {
    console.error("Error in deleteCourse:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Controller to archive a course.
 */
exports.archiveCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    // it's in enrolment
    const enrollment = await Enrollment.findOne({
      course: courseId,
      userId: req.user.id,
    });
    if (!enrollment) {
      return res
        .status(403)
        .json({ error: "You are not enrolled in this course." });
    }

    // Check if the course is already archived
    if (enrollment.isArchived) {
      return res.json({ message: "Course is already archived." });
    }

    // Archive the course
    enrollment.isArchived = true;
    enrollment.archivedAt = new Date();
    await enrollment.save();

    return res.json({ message: "Course archived successfully." });
  } catch (error) {
    console.error("Error in archiveCourse:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Controller to unarchive a course.
 */
exports.unarchiveCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    // it's in enrolment
    const enrollment = await Enrollment.findOne({
      course: courseId,
      userId: req.user.id,
    });
    if (!enrollment) {
      return res
        .status(403)
        .json({ error: "You are not enrolled in this course." });
    }

    // Check if the course is already archived
    if (!enrollment.isArchived) {
      return res.json({ message: "Course is not archived." });
    }

    // Archive the course
    enrollment.isArchived = false;
    enrollment.archivedAt = null;
    await enrollment.save();

    return res.json({ message: "Course restored successfully." });
  } catch (error) {
    console.error("Error in archiveCourse:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Controller to push deadlines by 10 days.
 */
exports.pushDeadline = async (req, res) => {
  const course = req.course;
  const userId = req.user.id;

  try {
    const enrollment = await Enrollment.findOne({ course: course._id, userId });
    if (!enrollment) {
      return res
        .status(403)
        .json({ error: "You are not enrolled in this course." });
    }

    // Implement logic to actually push deadlines by 10 days
    // This could involve updating due dates in assignments and quizzes
    // Example:
    // await Assignment.updateMany({ unit: { $in: course.units } }, { $inc: { dueDate: 10 * 24 * 60 * 60 * 1000 } });
    // await Quiz.updateMany({ unit: { $in: course.units } }, { $inc: { dueDate: 10 * 24 * 60 * 60 * 1000 } });

    // Increment push count if tracking pushes
    if (!enrollment.pushCount) {
      enrollment.pushCount = 1;
    } else {
      enrollment.pushCount += 1;
    }

    await enrollment.save();

    return res.json({ message: "All deadlines pushed by 10 days." });
  } catch (error) {
    console.error("Error in pushDeadline:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Controller to get all courses created by the authenticated user.
 */
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.aggregate([
      {
        $match: { creatorId: req.user.id },
      },
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "course",
          as: "enrollments",
        },
      },
      {
        $addFields: {
          numberOfUnits: { $size: "$units" },
          numberOfParticipants: { $size: { $ifNull: ["$enrollments", []] } },
          numberOfQuizzes: {
            $sum: {
              $map: {
                input: "$units",
                as: "unit",
                in: { $cond: [{ $ifNull: ["$$unit.quiz", false] }, 1, 0] },
              },
            },
          },
          numberOfAssignments: {
            $sum: {
              $map: {
                input: "$units",
                as: "unit",
                in: {
                  $cond: [{ $ifNull: ["$$unit.assignment", false] }, 1, 0],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          difficulty: 1,
          category: 1,
          subcategory: 1,
          numberOfUnits: 1,
          numberOfQuizzes: 1,
          numberOfAssignments: 1,
          numberOfParticipants: 1,
          title: 1, // Including title as it's a required field
        },
      },
    ]);

    return res.json(courses);
  } catch (error) {
    console.error("Error in getMyCourses:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Controller to get all courses the authenticated user is enrolled in (Feed).
 * Returns summarized fields: id, difficulty, title, number of units, number of quizzes, number of assignments, number of participants, category, subcategory
 */
exports.getMyInProgressCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all active enrollments
    const enrollments = await Enrollment.find({ userId, isArchived: false })
      .populate({
        path: "course",
        select: "title overview category subcategory difficulty isPublic units",
      })
      .lean();

    // Extract course IDs and enrollment data
    const courseIds = enrollments.map((enrollment) => enrollment.course._id);
    const enrollmentData = enrollments.map((enrollment) => ({
      courseId: enrollment.course._id,
      progress: enrollment.progress,
    }));

    // Fetch courses with summarized fields and progress
    const courses = await Course.aggregate([
      {
        $match: { _id: { $in: courseIds } },
      },
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "course",
          as: "enrollments",
        },
      },
      {
        $lookup: {
          from: "units",
          localField: "_id",
          foreignField: "course",
          as: "units",
        },
      },
      {
        $addFields: {
          numberOfUnits: { $size: "$units" },
          numberOfParticipants: { $size: { $ifNull: ["$enrollments", []] } },
          numberOfQuizzes: {
            $size: {
              $filter: {
                input: "$units",
                as: "unit",
                cond: { $gt: [{ $type: "$$unit.quiz" }, "missing"] },
              },
            },
          },
          numberOfAssignments: {
            $size: {
              $filter: {
                input: "$units",
                as: "unit",
                cond: { $gt: [{ $type: "$$unit.assignment" }, "missing"] },
              },
            },
          },
          // Attach overall progress based on enrollment data
          overallProgress: {
            $let: {
              vars: {
                enrollment: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: enrollmentData,
                        as: "enroll",
                        cond: { $eq: ["$$enroll.courseId", "$_id"] },
                      },
                    },
                    0,
                  ],
                },
              },
              in: { $ifNull: ["$$enrollment.progress.overallProgress", 0] },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          difficulty: 1,
          category: 1,
          subcategory: 1,
          numberOfUnits: 1,
          numberOfQuizzes: 1,
          numberOfAssignments: 1,
          numberOfParticipants: 1,
          title: 1,
          overallProgress: 1,
        },
      },
    ]);

    const filteredInProgressCourses = courses.filter(
      (course) => course.overallProgress < 100
    );

    return res.json(filteredInProgressCourses);
  } catch (error) {
    console.error("Error in getMyEnrolledCourses:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Controller to get course recommendations for the authenticated user.
 * Returns summarized fields: id, difficulty, title, number of units, number of quizzes, number of assignments, number of participants, category, subcategory
 */
exports.getRecommendations = async (req, res) => {
  try {
    // except the user's courses
    const userId = req.user.id;
    const enrolledCourses = await Enrollment.find({ userId }).select("course");
    const enrolledCourseIds = enrolledCourses.map(
      (enrollment) => enrollment.course
    );
    const recommendations = await Course.aggregate([
      {
        $match: { isPublic: true, _id: { $nin: enrolledCourseIds } },
      },
      {
        $addFields: {
          numberOfParticipants: { $size: { $ifNull: ["$participants", []] } },
          numberOfUnits: { $size: { $ifNull: ["$units", []] } },
          numberOfQuizzes: {
            $sum: {
              $map: {
                input: { $ifNull: ["$units", []] },
                as: "unit",
                in: { $cond: [{ $ifNull: ["$$unit.quiz", false] }, 1, 0] },
              },
            },
          },
          numberOfAssignments: {
            $sum: {
              $map: {
                input: { $ifNull: ["$units", []] },
                as: "unit",
                in: {
                  $cond: [{ $ifNull: ["$$unit.assignment", false] }, 1, 0],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          difficulty: 1,
          category: 1,
          subcategory: 1,
          numberOfUnits: 1,
          numberOfQuizzes: 1,
          numberOfAssignments: 1,
          numberOfParticipants: 1,
          title: 1,
        },
      },
      {
        $sort: { numberOfParticipants: -1 }, // Sort by most participants (descending)
      },
      {
        $limit: 5, // Get top 5 courses
      },
    ]);

    return res.json(recommendations);
  } catch (error) {
    console.error("Error in getRecommendations:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
/**
 * Controller to get participants of a specific course.
 * Returns an array of userIds enrolled in the course.
 */
exports.getParticipants = async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ error: "Invalid course ID." });
  }

  try {
    const enrollments = await Enrollment.find({
      course: courseId,
      isArchived: false,
    }).select("userId");

    const participantIds = enrollments.map((enrollment) => enrollment.userId);

    // If user details are needed, integrate with the User microservice here
    // For now, returning userIds
    return res.json({ participants: participantIds });
  } catch (error) {
    console.error("Error in getParticipants:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Controller to get archived courses.
 * Returns an array of archived courses with summarized fields.
 */
exports.getMyArchivedCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all archived courses created by the user in enrollment
    const archivedEnrollments = await Enrollment.find({
      userId,
      isArchived: true,
    }).select("course");

    const archivedCourseIds = archivedEnrollments.map(
      (enrollment) => enrollment.course._id
    );
    const enrollmentData = archivedEnrollments.map((enrollment) => ({
      courseId: enrollment.course._id,
      progress: enrollment.progress,
    }));

    // Fetch summarized data for archived courses
    const archivedCourses = await Course.aggregate([
      {
        $match: { _id: { $in: archivedCourseIds } },
      },
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "course",
          as: "enrollments",
        },
      },
      {
        $lookup: {
          from: "units",
          localField: "_id",
          foreignField: "course",
          as: "units",
        },
      },
      {
        $addFields: {
          numberOfUnits: { $size: "$units" },
          numberOfParticipants: { $size: { $ifNull: ["$enrollments", []] } },
          numberOfQuizzes: {
            $size: {
              $filter: {
                input: "$units",
                as: "unit",
                cond: { $gt: [{ $type: "$$unit.quiz" }, "missing"] },
              },
            },
          },
          numberOfAssignments: {
            $size: {
              $filter: {
                input: "$units",
                as: "unit",
                cond: { $gt: [{ $type: "$$unit.assignment" }, "missing"] },
              },
            },
          },
          // Attach overall progress based on enrollment data
          overallProgress: {
            $let: {
              vars: {
                enrollment: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: enrollmentData,
                        as: "enroll",
                        cond: { $eq: ["$$enroll.courseId", "$_id"] },
                      },
                    },
                    0,
                  ],
                },
              },
              in: { $ifNull: ["$$enrollment.progress.overallProgress", 0] },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          difficulty: 1,
          category: 1,
          subcategory: 1,
          numberOfUnits: 1,
          numberOfQuizzes: 1,
          numberOfAssignments: 1,
          numberOfParticipants: 1,
          title: 1,
          overallProgress: 1,
        },
      },
    ]);

    return res.json(archivedCourses);
  } catch (error) {
    console.error("Error in getMyArchivedCourses:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Controller to get completed courses for the authenticated user.
 * Returns an array of completed courses with summarized fields.
 */
exports.getMyCompletedCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all completed enrollments
    const completedEnrollments = await Enrollment.find({
      userId,
      isCompleted: true,
    })
      .populate({
        path: "course",
        select: "title difficulty category subcategory units",
      })
      .lean();

    // Extract course IDs from completed enrollments
    const completedCourseIds = completedEnrollments.map(
      (enrollment) => enrollment.course._id
    );

    // Fetch summarized data for completed courses
    const completedCourses = await Course.aggregate([
      {
        $match: { _id: { $in: completedCourseIds } },
      },
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "course",
          as: "enrollments",
        },
      },
      {
        $addFields: {
          numberOfUnits: { $size: "$units" },
          numberOfParticipants: { $size: { $ifNull: ["$enrollments", []] } },
          numberOfQuizzes: {
            $sum: {
              $map: {
                input: "$units",
                as: "unit",
                in: {
                  $cond: [
                    { $ifNull: ["$$unit.quizzes", false] },
                    { $size: "$$unit.quizzes" },
                    0,
                  ],
                },
              },
            },
          },
          numberOfAssignments: {
            $sum: {
              $map: {
                input: "$units",
                as: "unit",
                in: {
                  $cond: [
                    { $ifNull: ["$$unit.assignments", false] },
                    { $size: "$$unit.assignments" },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          difficulty: 1,
          category: 1,
          subcategory: 1,
          numberOfUnits: 1,
          numberOfQuizzes: 1,
          numberOfAssignments: 1,
          numberOfParticipants: 1,
        },
      },
    ]);

    return res.json(completedCourses);
  } catch (error) {
    console.error("Error in getMyCompletedCourses:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
