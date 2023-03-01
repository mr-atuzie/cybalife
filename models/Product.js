const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Please enter product name"],
    },
    sku: {
      type: String,
      trim: true,
      required: true,
      default: "SKU",
    },
    category: {
      type: String,
      trim: true,
      required: [true, "Please enter product category"],
    },
    quantity: {
      type: String,
      trim: true,
      required: [true, "Please enter product quantity"],
    },
    price: {
      type: String,
      trim: true,
      required: [true, "Please enter product price"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Please enter product description"],
    },
    image: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
