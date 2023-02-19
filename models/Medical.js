const mongoose = require("mongoose");

const medicalSchema = new mongoose.Schema({
  firstname: { type: String, trim: true },
  lastname: { type: String, trim: true },
  email: { type: String, unique: true },
  password: { type: String },
  specialization: { type: String },
  medId: { type: String },
});

const Medical = mongoose.model("Medical", medicalSchema);
module.exports = Medical;
