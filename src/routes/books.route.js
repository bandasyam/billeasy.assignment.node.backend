const express = require("express");
const router = express.Router();
const { decodeToken } = require("../middlewares/authentication.middleware");
const { decodeUser } = require("../middlewares/user.middleware");
const { bodyValidator } = require("../middlewares/joi.middleware");
const schema = require("../payloadschemas/book.payloadschema");
const controller = require("../controllers/books.controller");

/** add a new book */
router.post("/books", decodeToken, decodeUser, bodyValidator(schema.createBookSchema), controller.createBook);

module.exports = router;
