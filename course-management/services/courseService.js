// services/courseService.js
const axios = require("axios");
const Course = require("../models/Course");

async function generateAndCreateCourse(payload) {
  // payload e.g. { creator, prompt, category, subcategory, title, etc. }
  const generatorUrl = "http://course-generation:4004/generate-course";
  if (!generatorUrl) {
    throw new Error("GENERATOR_SERVICE_URL is not set.");
  }

  // 1) Call external generator
  //    The generator might return the units/chapters, etc. automatically
  const response = await axios.post(generatorUrl, {
    prompt: payload.prompt,
    category: payload.category,
    subcategory: payload.subcategory,
    difficulty: payload.difficulty,
    material_types: payload.material_types,
    assignment_types: payload.assignment_types,
  });
  const generatedData = response.data;
  // e.g. { title, overview, units: [ ... ] }

  // 2) Create the course
  const newCourse = new Course({
    // Some fields come from payload
    creator: payload.creator,
    is_public: !!payload.is_public,
    users_can_moderate: !!payload.users_can_moderate,
    material_types: payload.material_types,
    assignment_types: payload.assignment_types,
    title: generatedData.title || payload.title,
    overview: generatedData.overview || payload.overview,
    prompt: payload.prompt,
    category: payload.category,
    subcategory: payload.subcategory,
    difficulty: payload.difficulty,
    course_objectives: payload.course_objectives,

    // The generator might supply 'units' as well
    units: generatedData.units || [],
  });

  await newCourse.save();
  return newCourse;
}

module.exports = { generateAndCreateCourse };
