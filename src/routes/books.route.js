const express = require("express");
const router = express.Router();
const { decodeToken } = require("../middlewares/authentication.middleware");
const { decodeUser } = require("../middlewares/user.middleware");
const { bodyValidator, queryValidator, paramsValidator } = require("../middlewares/joi.middleware");
const schema = require("../payloadschemas/book.payloadschema");
const controller = require("../controllers/books.controller");

/** add a new book */
router.post("/", decodeToken, decodeUser, bodyValidator(schema.createBookSchema), controller.createBook);

/** get books */
router.get("/", queryValidator(schema.getBookQuery), controller.getBooks);

/** search books */
router.get("/search", queryValidator(schema.searchQuery), controller.searchBook);

/** write a review */
router.post(
  "/:id/review",
  decodeToken,
  decodeUser,
  paramsValidator(schema.bookParamsValidate),
  bodyValidator(schema.reviewBookSchema),
  controller.writeReview
);

module.exports = router;
