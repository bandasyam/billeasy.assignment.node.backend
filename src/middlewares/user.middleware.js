const { ObjectId } = require("mongodb");
const db = require("../utils/db.helpers");
const { createResponse } = require("../utils/helpers");

module.exports.decodeUser = async (req, res, next) => {
  try {
    let user = await db.findOne("users", { _id: new ObjectId(req.payload._id) });
    if (!user) {
      next(createResponse("user not found", 404));
    } else {
      req.user = user;
      next();
    }
  } catch (e) {
    next(e);
  }
};
