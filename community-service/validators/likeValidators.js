const Joi = require("joi");

exports.likePostSchema = Joi.object({
  // If you need body data for a Like, put it here.
  // e.g. userId, or anything else.
  // For now, let's assume no data is needed in the body to like a post.
});
