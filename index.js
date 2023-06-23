const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");

const errorHandler = require("./middlewares/errorMiddleware");
const userRoutes = require("./routes/user");
const houseRoutes = require("./routes/house");

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://just-erotics.web.app"],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// connect DB
const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
      console.log("Database connected successfuly.");
    })
    .catch((error) => {
      console.log(error);
    });
};

//Routes
app.get("/", (req, res) => {
  res.send("justerotic");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/house", houseRoutes);

//Error Middleware
app.use(errorHandler);

const PORT = 7000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Servering run on port:${PORT}`);
});
