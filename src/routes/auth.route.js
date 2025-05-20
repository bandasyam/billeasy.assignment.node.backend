const express = require("express");
const router = express.Router();

const { bodyValidator } = require("../middlewares/joi.middleware");
const schema = require("../payloadschemas/auth.payloadschema");
const controller = require("../controllers/auth.controller");

/** signup api */
router.post("/signup", bodyValidator(schema.authSchema), controller.signup);

/** login api */
router.post("/login", bodyValidator(schema.loginSchema), controller.login);

module.exports = router;
