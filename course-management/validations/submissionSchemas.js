// validations/submissionSchemas.js
const Joi = require("joi");

exports.assignmentSubmissionSchema = Joi.object({
  courseId: Joi.string().required(),
  unitId: Joi.string().required(),
  chapterId: Joi.string().required(),
});
