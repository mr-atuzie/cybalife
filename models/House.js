const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema(
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
    category: {
      type: String,
      trim: true,
      required: [true, "Please enter house type"],
    },
    price: {
      type: String,
      trim: true,
      required: [true, "Please enter house price"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Please enter house description"],
    },
    image: {
      type: Object,
      default: {},
    },
    numberOfRoom: {
      type: String,
      trim: true,
      required: [true, "Please enter number of rooms"],
    },
  },
  { timestamps: true }
);

const House = mongoose.model("Product", houseSchema);
module.exports = House;
