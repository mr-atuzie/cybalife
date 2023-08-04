const asyncHandler = require("express-async-handler");
const Chats = require("../models/Chats");
const User = require("../models/User");

//createChat
//getUserChat
//findChat

const createChat = asyncHandler(async (req, res) => {
  const { recipient } = req.body;

  const userId = req.user._id;

  //check for existing chat
  const chat = await Chats.findOne({ members: { $all: [userId, recipient] } });

  if (chat) {
    res.status(200).json(chat);
  }

  const newChat = new Chats({ members: [userId, recipient] });

  const response = await newChat.save();

  res.status(200).json(response);
});

const getUserChats = asyncHandler(async (req, res) => {
  const chats = await Chats.find({
    members: { $in: [req.user._id] },
  }).sort({
    createdAt: -1,
  });

  res.status(200).json(chats);
});

const findChat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);

  const messages = await Chats.findOne({
    members: { $all: [user._id, id] },
  }).sort({ createdAt: 1 });

  res.status(200).json(messages);
});

module.exports = {
  findChat,
  getUserChats,
  createChat,
};
