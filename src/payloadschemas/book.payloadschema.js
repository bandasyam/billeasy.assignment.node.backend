const joi = require("joi");

/** body validators */
const createBookSchema = joi.object({
  author: joi.string().lowercase().required(),
  title: joi.string().lowercase().required(),
  genre: joi.array().items(joi.string()).required(),
});

/** query validator */
const getBookQuery = joi.object({
  page: joi.number().positive().default(1),
  author: joi.string().allow(null),
  genre: joi.string().allow(null),
});

const searchQuery = joi.object({
  query: joi.string().lowercase().required(),
});

module.exports = { createBookSchema, getBookQuery, searchQuery };
