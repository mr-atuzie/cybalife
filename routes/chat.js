const express = require("express");
const chatController = require("../controllers/chat");
const protect = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/chat").post(protect, chatController.createChat);

router.route("/get-chats/:id").get(protect, chatController.findChat);

router.route("/recent-chats").get(protect, chatController.getUserChats);

module.exports = router;
