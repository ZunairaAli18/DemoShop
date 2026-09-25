const { log } = require("./logger");
const { sendToCrm } = require("./crm");

function buildProfile(customer) {
  return { id: customer.id, name: customer.name, source: "web" };
}

async function orderPlaced(customer, order) {
  log.info("Order placed", { orderId: order.id, customerId: customer.id });
  await sendToCrm("order_placed", {
    orderId: order.id,
    profile: buildProfile(customer),
  });
}

module.exports = { orderPlaced };
