const Message = require("../models/Message");
const asyncHandler = require("express-async-handler");

//create Message
//get Message

const createMessage = asyncHandler(async (req, res) => {
  const { sender, text, chatId } = req.body;

  const msg = new Message({ chatId, sender, text });

  const response = await msg.save();

  res.status(200).json(response);
});

const getMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const msgs = await Message.find({ chatId });

  res.status(200).json(msgs);
});

module.exports = { createMessage, getMessage };
