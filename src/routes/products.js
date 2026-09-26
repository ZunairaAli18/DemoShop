const express = require("express");
const { products } = require("../models/product");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(products.map(({ profit_margin, ...p }) => p));
});

module.exports = router;
