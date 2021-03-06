const express = require("express");
const searchController = require("./controllers/searchController");

const router = express.Router();
router.get("/search", async function(req, res) {
  const {
    query: { q: keyword, pageNum: pageNumber }
  } = req;
  const result = await searchController.search({
    keyword,
    pageNumber
  });
  res.json(result);
});

module.exports = router;
