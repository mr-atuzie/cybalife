const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true,
      required: [true, "Please enter your name"],
    },
    lastname: {
      type: String,
      trim: true,
      required: [true, "Please enter your name"],
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Please enter your  phone Number"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please enter your email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      trim: true,
      minLength: [6, "Password must be up to 6 characters"],
    },
    shippingname: {
      type: String,
      default: "",
    },
    shippingemail: {
      type: String,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    shippingphone: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      default: "",
    },
    cn: {
      type: String,
      default: "",
    },
    exp: {
      type: String,
      default: "",
    },
    cvv: {
      type: String,
      default: "",
    },
    pin: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
