const db = require("../utils/db.helpers");
const { createResponse } = require("../utils/helpers");

async function createBook(req, res, next) {
  try {
    const { author, title } = req.body;

    // check if book already exists
    let book = await db.findOne("books", { author: author, title: title });
    if (book) {
      return next(createResponse("Book already exists", 409));
    }

    // store the book
    let insertBookResult = await db.createOne("books", req.body);

    let responseToSend = {
      _id: insertBookResult.insertedId,
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

module.exports = { createBook, login };
