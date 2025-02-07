const Joi = require("joi");

exports.submitQuizSchema = Joi.object({
  courseId: Joi.string().required(),
  unitId: Joi.string().required(),
  quizId: Joi.string().required(),
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().required(),
        selectedAnswer: Joi.number().required(),
      })
    )
    .required(),
});
