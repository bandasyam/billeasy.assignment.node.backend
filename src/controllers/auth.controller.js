const bcrypt = require("bcrypt");
const db = require("../utils/db.helpers");
const { createResponse } = require("../utils/helpers");
const { createToken } = require("../middlewares/authentication.middleware");

async function signup(req, res, next) {
  try {
    const { email, password, displayName } = req.body;

    // check if email already exists
    let user = await db.findOne("users", { email: email });
    if (user) {
      return next(createResponse(`email already exists`, 409));
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // store the user
    let insertUserResult = await db.createOne("users", {
      email: email,
      password: hashedPassword,
      displayName: displayName,
    });

    let responseToSend = {
      _id: insertUserResult.insertedId,
      ...req.body,
    };
    res.status(201).send(responseToSend);
  } catch (e) {
    next(createResponse(e?.message));
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // check if email exists
    let user = await db.findOne("users", { email: email });
    if (!user) {
      return next(createResponse("email not found", 404));
    }

    // check if password is correct
    let validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return next(createResponse("Incorrect password", 400));
    }

    // remove password from user response for security concerns
    delete user.password;

    // send response
    res
      .header("token", createToken({ _id: user._id }, 60 * 60 * 7))
      .status(200)
      .send(user);
  } catch (e) {
    next(e?.message);
  }
}

module.exports = { signup, login };
