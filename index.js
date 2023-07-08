const path = require("path");
const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const ws = require("ws");
const jwt = require("jsonwebtoken");
const errorHandler = require("./middlewares/errorMiddleware");
const userRoutes = require("./routes/user");
const houseRoutes = require("./routes/house");
const Message = require("./models/Message");

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://statuesque-chebakia-db168b.netlify.app",
    ],
    credentials: true,
  })
);

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// connect DB
const connectDB = () => {
  mongoose
    .connect(process.env.DB)
    .then(() => {
      console.log("Database connected successfuly.");
    })
    .catch((error) => {
      console.log(error);
    });
};

//Routes
app.get("/", (req, res) => {
  res.send("house");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/house", houseRoutes);

//Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 7000;

const server = app.listen(PORT, () => {
  connectDB();
  console.log(`Servering run on port:${PORT}`);
});

// const server = app.listen(PORT);

const wss = new ws.WebSocketServer({ server });

wss.on("connection", (connection, req) => {
  const cookies = req.headers.cookie;

  if (cookies) {
    const tokenString = cookies
      .split(",")
      .find((str) => str.startsWith("token="));
    if (tokenString) {
      const token = tokenString.split("=")[1];
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
          if (err) {
            res.status(401);
            throw new Error("Invalid Token.");
          }

          const { id, username } = userData;

          connection.userId = id;
          connection.username = username;
        });
      }
    }
  }

  [...wss.clients].forEach((cl) => {
    cl.send(
      JSON.stringify({
        online: [...wss.clients].map((c) => ({
          userId: c.userId,
          username: c.username,
        })),
      })
    );
  });

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    console.log(messageData);

    const { recipient, text } = messageData;

    if (recipient && text) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
      });

      [...wss.clients]
        .filter((cl) => cl.userId === recipient)
        .forEach((cl) =>
          cl.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              _id: messageDoc._id,
              recipient,
            })
          )
        );
    }
  });
});
