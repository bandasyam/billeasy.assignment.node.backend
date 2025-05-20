require("dotenv").config();
const jwt = require("jsonwebtoken");
const { createResponse } = require("../utils/helpers");

module.exports.createToken = (payload, expiresIn = 60 * 60 * 24 * 365) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

module.exports.decodeToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next(createResponse("No token found", 401));
    }

    let decoded = jwt.verify(token.split("Bearer ")[1], process.env.JWT_SECRET);
    req.payload = decoded;

    next();
  } catch (e) {
    return next(createResponse("Token expired", 401));
  }
};
