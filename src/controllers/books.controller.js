const { client, transactionOptions } = require("../services/database.service");
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

async function searchBook(req, res, next) {
  try {
    let query = req.query.query;
    const books = await db.aggregate("books", [
      {
        $match: {
          $or: [{ title: { $regex: query, $options: "i" } }, { author: { $regex: query, $options: "i" } }],
        },
      },
    ]);

    res.status(200).send(books);
  } catch (e) {
    next(createResponse(e.message));
  }
}

async function writeReview(req, res, next) {
  const session = client.startSession();
  try {
    session.startTransaction(transactionOptions);

    const bookId = req.params.id;
    const user = req.user;

    // check if book exists
    let book = await db.findOneWithSession("books", { _id: bookId }, session);
    if (!book) {
      return next(createResponse("No book found with the given id", 404));
    }

    // check if user has already given review
    let userReview = await db.findOneWithSession("usersreviews", { userId: user._id, bookId: bookId }, session);
    if (userReview) {
      return next(createResponse("user has already given review to this book", 409));
    }

    // create review
    let inserReview = await db.createOneWithSession(
      "usersreviews",
      {
        userId: user._id,
        bookId: bookId,
        rating: req.body.rating,
        review: req.body.review,
      },
      session
    );

    if (!inserReview) {
      throw new Error("couldn't insert review");
    }

    // update totalReview to book
    const updatedRatingCount = (book.count || 0) + 1;
    const updatedAvgRating = ((book.rating || 0) * (book.count || 0) + req.body.rating) / updatedRatingCount;

    let updateResult = await db.updateOneWithSession(
      "books",
      { _id: bookId },
      { $set: { rating: Number(parseFloat(updatedAvgRating).toFixed(1)), count: updatedRatingCount } }
    );

    if (!updateResult) {
      throw new Error("couldn't set book review");
    }

    try {
      await session.commitTransaction();

      let updatedBook = await db.findOne("books", { _id: bookId });
      res.status(200).send(updatedBook);
    } catch (cte) {
      console.log(`commit transaction error`, cte);
      throw cte;
    }
  } catch (e) {
    console.log(e);
    await session.abortTransaction();
    next(createResponse(e?.message));
  } finally {
    await session.endSession();
  }
}

module.exports = { createBook, getBooks, searchBook, writeReview };
