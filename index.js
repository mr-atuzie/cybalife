const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const medicalRoutes = require("./routes/medical");
const storeRoutes = require("./routes/store");
const errorHandler = require("./middlewares/errorMiddleware");

const app = express();

//Middlewares
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Routes
app.get("/", (req, res) => {
  res.send("Cybalife");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/medicals", medicalRoutes);
app.use("/api/v1/stores", storeRoutes);

//Error Middleware
app.use(errorHandler);

//Connect DB and start Server
const PORT = 7000;
mongoose
  .connect(process.env.DB)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
