// validations/assignmentSchemas.js
const Joi = require("joi");

exports.submitAssignmentSchema = Joi.object({
  courseId: Joi.string().required(),
  unitId: Joi.string().required(),
  chapterId: Joi.string().required(),
});
