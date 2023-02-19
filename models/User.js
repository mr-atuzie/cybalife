const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: { type: String, trim: true },
  lastname: { type: String, trim: true },
  email: { type: String, unique: true },
  password: { type: String },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
