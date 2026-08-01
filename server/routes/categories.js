const express = require("express");
const router = express.Router();
const products = require("../data/data");

router.get("/", (req, res) => {
  const categories = [...new Set(products.map((p) => p.category))];
  res.json({
    success: true,
    data: categories
  });
});

module.exports = router;
