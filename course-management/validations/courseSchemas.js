// validations/courseSchemas.js
const Joi = require("joi");

exports.createCourseSchema = Joi.object({
  is_public: Joi.boolean().optional(),
  users_can_moderate: Joi.boolean().optional(),
  material_types: Joi.array()
    .items(Joi.string().valid("reading", "video"))
    .required(),
  assignment_types: Joi.array()
    .items(Joi.string().valid("writing", "presentation", "quiz"))
    .required(),
  title: Joi.string().optional(),
  overview: Joi.string().optional(),
  prompt: Joi.string().required(),
  category: Joi.string().required(),
  subcategory: Joi.string().required(),
  difficulty: Joi.string()
    .valid("beginner", "intermediate", "advanced")
    .required(),
  course_objectives: Joi.string().optional(),
});
