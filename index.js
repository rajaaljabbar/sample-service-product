const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8081;

// Import router
const productRouter = require("./src/controller/controller-product");
const authRouter = require("./src/controller/controller-auth");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Gunakan router
app.use("/api", productRouter);
app.use("/api/auth", authRouter);

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}/api/products`);
});

module.exports = app;
