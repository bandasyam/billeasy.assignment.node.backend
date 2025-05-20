module.exports.createResponse = (message, statusCode = 500) => {
  return { statusCode, message };
};
