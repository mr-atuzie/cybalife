const mongoose = require("mongoose");

const chatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    senderPhoto: {
      type: String,
    },
    recipientPhoto: {
      type: String,
    },
    senderName: {
      type: String,
    },
    recipientName: {
      type: String,
    },
    LastMessage: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Chats = mongoose.model("Chats", chatsSchema);

module.exports = Chats;
