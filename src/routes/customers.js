const express = require("express");
const { findCustomer } = require("../models/customer");

const router = express.Router();

// Placeholder until sign-up dates are stored on the customer.
const MEMBER_SINCE = "2024-01-15";

// Returns only public fields. Never return the whole customer object.
router.get("/:id/summary", (req, res) => {
  const customer = findCustomer(req.params.id);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  res.json({ id: customer.id, name: customer.name, memberSince: MEMBER_SINCE });
});

module.exports = router;
