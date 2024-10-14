"use strict";

var Joi = require('joi');

var validate = function validate(schema) {
  return function (req, res, next) {
    var _schema$validate = schema.validate(req.body),
        error = _schema$validate.error;

    if (error) {
      return res.status(400).json({
        error: error.details[0].message
      });
    }

    next();
  };
};

module.exports = validate;