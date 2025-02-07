// services/courseService.js
const axios = require("axios");
const Course = require("../models/Course");
const Unit = require("../models/Unit");
const Chapter = require("../models/Chapter");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Assignment = require("../models/Assignment");
const asyncLib = require("async"); // Import the async library
const Enrollment = require("../models/Enrollment");
const { ASSIGNMENT_TYPES, MATERIAL_TYPES } = require("../constants");

async function generateUnitContent(payload) {
  const generatorUrl = "http://course-generation:4004/generate-unit-content";
  if (!generatorUrl) {
    throw new Error("GENERATOR_SERVICE_URL is not set.");
  }

  const unit = await axios.post(generatorUrl, {
    unit: payload.unit,
    prompt: payload.prompt,
    difficulty: payload.difficulty,
    material_types: MATERIAL_TYPES,
    assignment_types: ASSIGNMENT_TYPES,
  });
  return unit;
}

async function generateCourseOutline(payload) {
  // payload e.g. { prompt, category, subcategory, difficulty, material_types, assignment_types }
  const generatorUrl = "http://course-generation:4004/generate-course-outline";
  if (!generatorUrl) {
    throw new Error("GENERATOR_SERVICE_URL is not set.");
  }

  const response = await axios.post(generatorUrl, {
    prompt: payload.prompt,
    category: payload.category,
    subcategory: payload.subcategory,
    difficulty: payload.difficulty,
    material_types: MATERIAL_TYPES,
    assignment_types: ASSIGNMENT_TYPES,
  });
  return response.data;
}

/**
 * Prepares the payload from the request.
 */
const preparePayload = (req) => ({
  ...req.body,
  creatorId: req.user.id,
});

/**
 * Checks if the user has reached the course creation limit.
 */
const checkCourseLimit = async (creatorId) => {
  const courseCount = await Course.countDocuments({ creatorId });
  if (courseCount >= 5) {
    throw { status: 400, message: "You have reached the limit of 5 courses." };
  }
};

/**
 * Handles the asynchronous creation of the course and its related entities.
 */
const createCourseAsync = async (payload, generatedData, newCourse, userId) => {
  try {
    console.log(`Initial course created with ID: ${newCourse._id}`);

    const queue = initializeQueue(newCourse, payload, generatedData, userId);

    // Push all units to the queue
    generatedData.units.forEach((unit) => {
      queue.push(unit, (err) => {
        if (err) {
          console.error(`Unit "${unit.title}" encountered an error:`, err);
          // Optional: Implement individual unit error handling
        }
      });
    });

    // Handle queue drain
    queue.drain(() => {
      console.log("All units have been processed and added to the course.");
      // toggle generated flag
      newCourse.generated = true;
      newCourse.save();
    });

    // Handle queue errors
    queue.error((err, unit) => {
      console.error(`Unit "${unit.title}" failed to process:`, err);
      // Optional: Implement further error handling (e.g., notify admins, retry logic)
    });
  } catch (creationError) {
    console.error("Error during asynchronous course creation:", creationError);
    // Optional: Implement rollback logic if necessary
  }
};

/**
 * Initializes the Course document without units.
 */
const initializeCourse = async (payload, generatedData, userId) => {
  const initialCourseData = {
    creatorId: payload.creatorId,
    isPublic: Boolean(payload.isPublic || true),
    usersCanModerate: Boolean(payload.usersCanModerate),
    materialTypes: payload.materialTypes,
    assignmentTypes: payload.assignmentTypes,
    title: generatedData.title,
    overview: generatedData.overview,
    prompt: payload.prompt,
    category: payload.category,
    subcategory: payload.subcategory,
    difficulty: payload.difficulty,
    courseObjectives: payload.courseObjectives,
    units: [], // Initialize with an empty array
    generated: false,
    participants: [userId],
  };

  const newCourse = new Course(initialCourseData);
  await newCourse.save();
  return newCourse;
};

/**
 * Initializes the async.queue with a concurrency limit and a worker function.
 */
const initializeQueue = (newCourse, payload, generatedData, userId) => {
  const q = asyncLib.queue((unitData, callback) => {
    // Remove the 'async' keyword to ensure 'callback' is a function
    processUnit(unitData, payload, generatedData, newCourse._id)
      .then(async (unit) => {
        try {
          // Push the Unit ID to the Course's units array
          await Course.findByIdAndUpdate(
            newCourse._id,
            { $push: { units: unit._id } },
            { new: true }
          );
          console.log(
            `Unit "${unit.title}" added to course "${newCourse.title}".`
          );

          const enrollment = await Enrollment.findOne({
            course: newCourse._id,
            userId,
          });

          if (!enrollment) {
            await enrollCreator(userId, newCourse._id);
          }
          const unitProgress = {
            unit: unit._id,
            completed: false,
            chaptersProgress: unit.chapters.map((chapter) => ({
              chapter: chapter._id,
              completed: false,
            })),
            assignmentProgress: unit.assignment
              ? {
                  assignment: unit.assignment,
                  submitted: false,
                  submissionDate: null,
                  grad: null,
                  feedback: null,
                }
              : null,
            quizProgress: unit.quiz
              ? {
                  quiz: unit.quiz,
                  completed: false,
                  score: null,
                  attempts: 0,
                  lastAttempted: null,
                }
              : null,
          };

          enrollment.progress.unitsProgress.push(unitProgress);
          await enrollment.save();

          callback(); // Indicate successful task completion
        } catch (updateError) {
          console.error(
            `Error updating course with unit "${unit.title}":`,
            updateError
          );
          callback(updateError); // Pass the error to the queue
        }
      })
      .catch((err) => {
        console.error(`Error processing unit "${unitData.title}":`, err);
        callback(err); // Pass the error to the queue
      });
  }, 1); // Set concurrency limit to 3

  return q;
};

/**
 * Processes a single unit: generates content, creates documents, and links them.
 */
const processUnit = async (unitData, payload, generatedData, courseId) => {
  // 1. Generate unit content
  let generatedUnit = await generateUnitContent({
    ...generatedData,
    ...payload,
    unit: unitData,
  });
  generatedUnit = generatedUnit.data;

  // 2. Create Unit document
  const unit = new Unit({
    course: courseId,
    title: generatedUnit.title,
    chapters: [],
  });
  await unit.save();
  console.log(`Unit "${unit.title}" created with ID: ${unit._id}`);

  // 3. Create Chapter documents
  const chapters = await createChapters(generatedUnit, unit._id);
  unit.chapters = chapters.map((c) => c._id);
  console.log(`Chapters for unit "${unit.title}" created.`);

  // 4. Create Quiz (if exists)
  const quizId = await createQuiz(generatedUnit, unit._id, unit.title);

  // 5. Create Assignment (if exists)
  const assignmentId = await createAssignment(
    generatedUnit,
    unit._id,
    unit.title
  );

  // 6. Update Unit with Quiz and Assignment references
  unit.quiz = quizId;
  unit.assignment = assignmentId;
  await unit.save();
  console.log(
    `Unit "${unit.title}" updated with Quiz and Assignment references.`
  );

  return unit;
};

/**
 * Creates Chapter documents for a unit.
 */
const createChapters = async (generatedUnit, unitId) => {
  const chapterPromises = generatedUnit.chapters.map((chapterData) => {
    const chapter = new Chapter({
      unit: unitId,
      title: chapterData.title,
      content: chapterData.content,
      youtubeQuery: chapterData.youtube_query,
      youtubeLink: chapterData.youtube_link,
    });
    return chapter.save();
  });

  const chapters = await Promise.all(chapterPromises);
  return chapters;
};

/**
 * Creates a Quiz document and its Questions if they exist.
 */
const createQuiz = async (generatedUnit, unitId, unitTitle) => {
  if (!generatedUnit.quiz) return null;

  const quiz = new Quiz({
    unit: unitId,
    title: generatedUnit.quiz.title,
    dueDate: generatedUnit.quiz.dueDate || null,
    overview: generatedUnit.quiz.overview || "",
    totalPoints: 0, // Will be updated after adding questions
    questions: [],
  });
  await quiz.save();
  console.log(`Quiz "${quiz.title}" created with ID: ${quiz._id}`);

  // Create Questions
  const questions = await createQuestions(
    generatedUnit.quiz,
    quiz._id,
    quiz.title
  );

  // Update Quiz with question IDs and calculate totalPoints
  quiz.questions = questions.map((q) => q._id);
  quiz.totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  await quiz.save();
  console.log(`Quiz "${quiz.title}" updated with questions.`);

  return quiz._id;
};

/**
 * Creates Question documents for a Quiz.
 */
const createQuestions = async (quizData, quizId, quizTitle) => {
  const questionPromises = quizData.questions.map((questionData) => {
    let question;
    if (questionData.type === "true_false") {
      question = new Question({
        quiz: quizId,
        type: questionData.type,
        questionText: questionData.question,
        options: questionData.options || [],
        correctAnswer: questionData.correct_answer == "0",
        explanation: questionData.explanation || "",
        points: questionData.points || 1,
      });
    } else {
      question = new Question({
        quiz: quizId,
        type: questionData.type,
        questionText: questionData.question,
        options: questionData.options,
        correctAnswer: questionData.correct_answer,
        explanation: questionData.explanation || "",
        points: questionData.points || 1,
      });
    }
    return question.save();
  });

  const questions = await Promise.all(questionPromises);
  console.log(`Questions for quiz "${quizTitle}" created.`);
  return questions;
};

/**
 * Creates an Assignment document based on its type.
 */
const createAssignment = async (generatedUnit, unitId, unitTitle) => {
  if (!generatedUnit.assignment) return null;

  const assignmentData = generatedUnit.assignment;
  const assignment = new Assignment({
    unit: unitId,
    title: assignmentData.title,
    overview: assignmentData.overview || "",
    dueDate: assignmentData.dueDate || null,
  });

  // Use discriminators based on assignmentType
  if (assignmentData.assignment_type) {
    assignment.assignmentType = assignmentData.assignment_type.toLowerCase();
  }

  // Add discriminator-specific fields
  if (assignmentData.assignment_type === "writing") {
    assignment.wordCount = assignmentData.wordCount || 100;
  } else if (assignmentData.assignment_type === "presentation") {
    assignment.slides = assignmentData.slides || 5;
    assignment.duration = assignmentData.duration || 5;
  }

  await assignment.save();
  console.log(
    `Assignment "${assignment.title}" created with ID: ${assignment._id}`
  );

  return assignment._id;
};

/**
 * Enrolls the creator in the newly created course.
 */
const enrollCreator = async (userId, courseId) => {
  try {
    const units = await Unit.find({ course: courseId });

    const unitsProgress = units.map((unit) => ({
      unit: unit._id,
      completed: false,
      chaptersProgress: [],
      assignmentsProgress: [],
      quizzesProgress: [],
    }));

    const enrollment = new Enrollment({
      userId,
      course: courseId,
      progress: {
        overallProgress: 0,
        startedAt: new Date(),
        unitsProgress,
      },
    });
    await enrollment.save();
    console.log(`Enrollment for course "${courseId}" created successfully.`);
  } catch (enrollmentError) {
    console.error("Error creating enrollment:", enrollmentError);
    // Optional: Implement further error handling (e.g., notify admins)
  }
};

module.exports = {
  generateCourseOutline,
  preparePayload,
  checkCourseLimit,
  createCourseAsync,
  initializeCourse,
  enrollCreator,
};
