const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Notfications needs a name"],
    },
    photo: {
      type: String,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notofication", notificationSchema);

module.exports = Notification;
