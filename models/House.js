const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    address: {
      type: String,
      trim: true,
    },
    propertySize: {
      type: String,
      trim: true,
    },
    propertyType: {
      type: String,
      trim: true,
    },
    yearBuilt: {
      type: String,
      trim: true,
    },
    lotSize: {
      type: String,
      trim: true,
    },
    numberOfBedrooms: {
      type: String,
      trim: true,
    },
    numberOfPartialBathrooms: {
      type: String,
      trim: true,
    },
    price: {
      type: String,
      trim: true,
    },
    desc: {
      type: String,
      trim: true,
    },
    electricBill: {
      type: String,
      trim: true,
    },
    waterBill: {
      type: String,
      trim: true,
    },
    wasteBill: {
      type: String,
      trim: true,
    },
    image: {
      type: Object,
      default: {},
    },
    buildingType: {
      type: String,
      trim: true,
    },
    numberOfFullBathrooms: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    windows: {
      type: String,
      trim: true,
    },
    unit: {
      type: String,
      trim: true,
    },
    leasePeriod: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const House = mongoose.model("Listing", houseSchema);
module.exports = House;
