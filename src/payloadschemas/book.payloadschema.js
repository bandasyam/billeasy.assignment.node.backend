const joi = require("joi");

/** body validators */
const createBookSchema = joi.object({
  author: joi.string().required(),
  title: joi.string().required(),
  genre: joi.array().items(joi.string()).required(),
});

module.exports = { createBookSchema };
