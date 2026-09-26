const express = require("express");
const { products } = require("../models/product");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(products);
});

module.exports = router;
