const mongoose = require("mongoose");

const chatsSchema = new mongoose.Schema(
  {
    members: Array,
  },
  { timestamps: true }
);

const Chats = mongoose.model("Chats", chatsSchema);

module.exports = Chats;
