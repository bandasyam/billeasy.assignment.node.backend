const { client, transactionOptions } = require("../services/database.service");
const db = require("../utils/db.helpers");
const { createResponse } = require("../utils/helpers");

async function updateReview(req, res, next) {
  const session = client.startSession();
  try {
    session.startTransaction(transactionOptions);

    const reviewId = req.params.id;
    const user = req.user;

    // check if user has given review
    let userReview = await db.findOneWithSession("usersreviews", { _id: reviewId }, session);
    if (!userReview) {
      return next(createResponse("No user review found with the given id", 409));
    }

    // check if user has permission to edit this review
    if (userReview.userId.toString() != user._id.toString()) {
      return next(createResponse("You don't have permission to edit this book", 403));
    }

    let dataToUpdate = {};
    if (req.body.rating) {
      dataToUpdate["rating"] = req.body.rating;
    }

    if (req.body.review) {
      dataToUpdate["review"] = req.body.review;
    }

    if (Object.keys(dataToUpdate).length == 0) {
      return res.status(200).send({ message: "Nothing to update" });
    }

    // update user review
    let updateUserReview = await db.updateOneWithSession("usersreviews", { _id: reviewId }, { $set: dataToUpdate }, session);
    if (!updateUserReview) {
      throw new Error("couldn't update user reviews");
    }

    let book = await db.findOneWithSession("books", { _id: userReview.bookId }, session);

    // if there is no rating to update then send the book directly
    if (!dataToUpdate?.rating) {
      try {
        await session.commitTransaction();
        return res.status(200).send(book);
      } catch (cte) {
        console.log(`commit transaction error`, cte);
        throw cte;
      }
    }

    // calculate the updated avg by user
    const totalRating = book.rating * book.count;
    const newTotalRating = totalRating - userReview.rating + (req.body.rating || 0);
    let newAvgRating = newTotalRating / book.count;
    newAvgRating = Number(parseFloat(newAvgRating).toFixed(1));

    // Persist the updated review and avgRating
    let updateResult = await db.updateOneWithSession("books", { _id: userReview.bookId }, { $set: { rating: newAvgRating } });
    if (!updateResult) {
      throw new Error("couldn't update book rating");
    }

    try {
      await session.commitTransaction();

      let updatedBook = await db.findOne("books", { _id: userReview.bookId });
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

module.exports = { updateReview };
