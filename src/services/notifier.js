const { log } = require("./logger");
const { sendToCrm } = require("./crm");

function buildProfile(customer) {
  return { id: customer.id, name: customer.name, source: "web" };
}

async function orderPlaced(customer, order) {
  log.info("Order placed", {
    orderId: order.id,
    customerId: customer.id,
    itemCount: order.items.length,
  });
  await sendToCrm("order_placed", {
    orderId: order.id,
    itemCount: order.items.length,
    createdAt: order.createdAt,
    profile: buildProfile(customer),
  });
}

module.exports = { orderPlaced };
