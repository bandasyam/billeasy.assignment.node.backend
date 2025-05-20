const joi = require("joi");

/** body validators */
const authSchema = joi.object({
  displayName: joi.string().lowercase().required(),
  email: joi.string().lowercase().email().required(),
  password: joi.string().required(),
});

const loginSchema = joi.object({
  email: joi.string().lowercase().email().required(),
  password: joi.string().required(),
});

module.exports = { authSchema, loginSchema };
