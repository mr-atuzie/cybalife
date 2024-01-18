const mongoose = require("mongoose");

const pakamUserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true,
      required: [true, "Please enter your firstname"],
    },
    lastname: {
      type: String,
      trim: true,
      required: [true, "Please enter your lastname"],
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please enter your username"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      trim: true,
      minLength: [8, "Password must be up to 8 characters"],
    },
  },
  { timestamps: true }
);

const PakamUser = mongoose.model("Pakam-User", pakamUserSchema);
module.exports = PakamUser;
