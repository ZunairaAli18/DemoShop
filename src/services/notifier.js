const { log } = require("./logger");
const { sendToCrm } = require("./crm");

function buildProfile(customer) {
  return { ...customer, source: "web" };
}

async function orderPlaced(customer, order) {
  log.info("Order placed", { orderId: order.id, customer });
  await sendToCrm("order_placed", {
    orderId: order.id,
    profile: buildProfile(customer),
  });
}

module.exports = { orderPlaced };
