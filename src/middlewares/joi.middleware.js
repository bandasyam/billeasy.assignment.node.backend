const { createResponse } = require("../utils/helpers");

module.exports.bodyValidator = (schema) => {
  return (req, res, next) => {
    var { value, error } = schema.required().validate(req.body);
    if (error) {
      return next(createResponse(error.message, 400));
    } else {
      req.body = value;
      next();
    }
  };
};

module.exports.paramsValidator = (schema) => {
  return (req, res, next) => {
    var { value, error } = schema.required().validate(req.params);
    if (error) {
      return next(createResponse(error.message, 400));
    } else {
      req.params = value;
      next();
    }
  };
};

module.exports.queryValidator = (schema) => {
  return (req, res, next) => {
    var { value, error } = schema.required().validate(req.query);
    if (error) {
      return next(createResponse(error.message, 400));
    } else {
      req.query = value;
      next();
    }
  };
};
