const { db } = require("../services/database.service");

async function findOne(collectionName, query) {
  try {
    return await db.collection(collectionName).findOne(query);
  } catch (e) {
    throw e;
  }
}

async function findOneWithSession(collectionName, query, session) {
  try {
    return await db.collection(collectionName).findOne(query, { session });
  } catch (e) {
    throw e;
  }
}

async function createOne(collectionName, data) {
  try {
    return await db.collection(collectionName).insertOne(data);
  } catch (e) {
    throw e;
  }
}

async function createOneWithSession(collectionName, query, session) {
  try {
    return await db.collection(collectionName).insertOne(query, { session });
  } catch (e) {
    throw e;
  }
}

async function updateOneWithSession(collectionName, findQuery, updateQuery, session) {
  try {
    return await db.collection(collectionName).findOneAndUpdate(findQuery, updateQuery, { session, returnDocument: "after" });
  } catch (e) {
    throw e;
  }
}

async function deleteOneWithSession(collectionName, findQuery, session) {
  try {
    return await db.collection(collectionName).findOneAndDelete(findQuery, { session });
  } catch (e) {
    throw e;
  }
}

async function aggregate(collectionName, aggregate) {
  try {
    return await db.collection(collectionName).aggregate(aggregate).toArray();
  } catch (e) {
    throw e;
  }
}

module.exports = { findOne, findOneWithSession, createOne, createOneWithSession, updateOneWithSession, deleteOneWithSession, aggregate };
