const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const contactUs = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    res.status(400);
    throw new Error("Please enter a subject and message.");
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(400);
    throw new Error("User not found , Please sign up.");
  }

  const send_from = user.email;
  const send_to = process.env.EMAIL_USER;
  const reply_to = user.email;

  try {
    await sendEmail(subject, message, send_to, send_from, reply_to);
    res
      .status(200)
      .json({ success: true, message: "Email sent successfully." });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent , Please try again.");
  }
});

module.exports = {
  contactUs,
};
