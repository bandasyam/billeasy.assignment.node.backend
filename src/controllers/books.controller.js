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

async function getBooks(req, res, next) {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = 10;
    let skip = (page - 1) * limit;

    let matchQuery = {};
    if (req.query?.author) {
      matchQuery["author"] = { $regex: req.query?.author, $options: "i" };
    }

    if (req.query?.genre) {
      matchQuery["genre"] = { $in: req.query?.genre.split(",") };
    }

    let aggregation = [
      {
        $match: matchQuery,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    let result = await db.aggregate("books", aggregation);
    res.status(200).send(result);
  } catch (e) {
    next(createResponse(e.message));
  }
}

module.exports = { createBook, getBooks };
