const mongoose = require("mongoose");

const pakamAssessmentSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      trim: true,
      required: [true, "Please enter your firsname"],
    },
    desc: {
      type: String,
      trim: true,
      required: [true, "Please enter your description"],
    },
    quantity: {
      type: String,
      trim: true,
      required: [true, "Please enter your quantity"],
    },
  },
  { timestamps: true }
);

const PakamAssessment = mongoose.model(
  "Pakam-Assessment",
  pakamAssessmentSchema
);
module.exports = PakamAssessment;
