const express = require("express");
const { findCustomer } = require("../models/customer");

const router = express.Router();

// Returns the customer for the account page.
router.get("/:id/summary", (req, res) => {
  const customer = findCustomer(req.params.id);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  res.json({ id: customer.id, name: customer.name });
});

module.exports = router;
