const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401);
    throw new Error("Not authorized ,Please login.");
  }

  const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!verifyToken) {
    res.status(401);
    throw new Error("Token has expired, Please login again.");
  }

  const user = await User.findById(verifyToken.id).select("-password");

  req.user = user;

  next();
});

module.exports = protect;
