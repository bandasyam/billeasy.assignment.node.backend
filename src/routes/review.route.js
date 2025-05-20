const express = require("express");
const router = express.Router();
const { decodeToken } = require("../middlewares/authentication.middleware");
const { decodeUser } = require("../middlewares/user.middleware");
const { paramsValidator, bodyValidator } = require("../middlewares/joi.middleware");
const schema = require("../payloadschemas/book.payloadschema");
const controller = require("../controllers/reviews.controller.js");

/** update review */
router.put(
  "/:id",
  decodeToken,
  decodeUser,
  bodyValidator(schema.updateReviewSchema),
  paramsValidator(schema.bookParamsValidate),
  controller.updateReview
);

/** delete review */
// router.delete("/:id", decodeToken, decodeUser, paramsValidator(schema.bookParamsValidate), controller.getBooks);

module.exports = router;
