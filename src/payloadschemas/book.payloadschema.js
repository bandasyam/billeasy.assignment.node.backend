const joi = require("joi");
const { ObjectId } = require("mongodb");

const createObject = (value, helpers) => {
  return new ObjectId(value);
};

/** body validators */
const createBookSchema = joi.object({
  author: joi.string().lowercase().required(),
  title: joi.string().lowercase().required(),
  genre: joi.array().items(joi.string()).required(),
  rating: joi.number().default(0).allow(0),
  count: joi.number().default(0).allow(0),
});

const reviewBookSchema = joi.object({
  rating: joi.number().positive().max(5).required(),
  review: joi.string().required(),
});

const updateReviewSchema = joi.object({
  rating: joi.number().positive().max(5),
  review: joi.string(),
});

/** params validator */
const bookParamsValidate = joi.object({
  id: joi.string().hex().length(24).custom(createObject).required(),
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

module.exports = { createBookSchema, reviewBookSchema, updateReviewSchema, bookParamsValidate, getBookQuery, searchQuery };
