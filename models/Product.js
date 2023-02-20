const mongoose = require("mongoose");

const prroductSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  price: { type: Number },
  location: { type: String },
  desc: { type: String, trim: true },
});

const Product = mongoose.model("Product", prroductSchema);
module.exports = Product;
