const express = require("express");
const ordersRouter = require("./routes/orders");
const customersRouter = require("./routes/customers");
const productsRouter = require("./routes/products");

const app = express();
app.use(express.json());

app.use("/orders", ordersRouter);
app.use("/customers", customersRouter);
app.use("/products", productsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`demo-shop listening on ${port}`);
});
