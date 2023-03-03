const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact");
const protect = require("../middlewares/authMiddleware");

router.route("/").post(protect, contactController.contactUs);

module.exports = router;
