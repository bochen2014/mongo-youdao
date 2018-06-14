const db = require("../db");

const search = async keyword => {
  const results = await db
    .get()
    .collection("words")
    .find()
    .limit(10)
    .toArray();
  return {
    q: keyword,
    results
  };
};

module.exports = {
  search
};
