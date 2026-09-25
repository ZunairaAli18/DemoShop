const { log } = require("./logger");
const { sendToCrm } = require("./crm");

async function orderPlaced(customer, order) {
  // Safe: only ids and name leave the app, never cnic/phone/email/address.
  log.info("Order placed", { orderId: order.id, customerId: customer.id });
  await sendToCrm("order_placed", {
    orderId: order.id,
    customerId: customer.id,
    name: customer.name,
  });
}

module.exports = { orderPlaced };
