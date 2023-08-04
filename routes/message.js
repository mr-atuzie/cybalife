const express = require("express");
const msgController = require("../controllers/message");
const protect = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").post(protect, msgController.createMessage);

router.route("/:chatId").get(protect, msgController.getMessage);

module.exports = router;
