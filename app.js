require("dotenv").config();
const db = require("./src/services/database.service");
const { createResponse } = require("./src/utils/helpers");

let serverInitialized = false;

(async () => {
  try {
    await db.connectdb();

    serverInitialized = true;
  } catch (e) {
    console.error(`Error occured when starting the admin server with a message ${e.message}`);
    process.exit(1);
  }
})();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const authRouter = require("./src/routes/auth.route");
const booksRouter = require("./src/routes/books.route");
const reviewsRouter = require("./src/routes/review.route");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Orign, X-Requested-With,Content-Type,Accept,Authorization", "token");
  res.header("Access-Control-Expose-Headers", "token");
  next();
});

app.use((req, res, next) => {
  if (serverInitialized) {
    next();
  } else {
    next(createResponse("Server not initialized yet", 503));
  }
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRouter);
app.use("/api/books", booksRouter);
app.use("/api/reviews", reviewsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createResponse("Api path doesn't exists", 404));
});

// error handler
app.use(function (err, req, res, next) {
  let message = err?.message || "Error undefined";
  let statusCode = err?.statusCode || 500;
  res.status(statusCode).send({ message: message });
});

module.exports = app;
