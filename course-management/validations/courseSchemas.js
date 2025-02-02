// validations/courseSchemas.js
const Joi = require("joi");

exports.createCourseSchema = Joi.object({
  isPublic: Joi.boolean().optional(),
  usersCanModerate: Joi.boolean().optional(),
  materialTypes: Joi.array()
    .items(Joi.string().valid("reading", "video"))
    .required(),
  assignmentTypes: Joi.array()
    .items(Joi.string().valid("writing", "presentation", "quiz"))
    .required(),
  title: Joi.string().optional(),
  overview: Joi.string().optional(),
  prompt: Joi.string().min(10).required(),
  category: Joi.string().required(),
  subcategory: Joi.string().required(),
  difficulty: Joi.string()
    .valid("beginner", "intermediate", "advanced")
    .required(),
  courseObjectives: Joi.string().optional(),
});
