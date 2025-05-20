const { db } = require("../services/database.service");

async function findOne(collectionName, query) {
  try {
    return await db.collection(collectionName).findOne(query);
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

module.exports = { findOne, createOne };
