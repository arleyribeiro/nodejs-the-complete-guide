const { validationResult } = require("express-validator");

exports.validationResult = (req, message) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
		const error = new Error(message);
    error.statusCode = StatusCode.UNPRECESSABLE_ENTITY;
    error.data = errors.array();
		throw error;
  }
};

exports.validateDataError = (data, message, statusCode) => {
  if (!data) {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
  }
};

exports.internalServerError = (err, next) => {
  if (!err.statusCode) {
    err.statusCode = StatusCode.INTERNAL_SERVER_ERROR;
  }
  next(err);
};