const express = require("express");
const { findCustomer } = require("../models/customer");
const { orderPlaced } = require("../services/notifier");

const router = express.Router();
let nextOrderId = 1000;

router.post("/", async (req, res) => {
  const customer = findCustomer(req.body.customerId);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  const order = {
    id: nextOrderId++,
    customerId: customer.id,
    items: req.body.items || [],
  };

  await orderPlaced(customer, order);
  res.status(201).json({ orderId: order.id });
});

module.exports = router;
