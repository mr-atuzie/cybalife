const express = require("express");
const morgan = require("morgan");

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const medicalRoutes = require("./routes/medical");
const storeRoutes = require("./routes/store");

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/medical", medicalRoutes);
app.use("/api/v1/store", storeRoutes);

module.exports = app;
