const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  products: { type: Array, default: [] },
});

const Store = mongoose.model("Store", storeSchema);
module.exports = Store;
