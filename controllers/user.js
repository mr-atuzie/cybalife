const User = require("../models/User");
const Token = require("../models/Token");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill up all required fields.");
  }

  //Check password length
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters.");
  }

  //Check if user already exist
  const checkEmail = await User.findOne({ email });

  if (checkEmail) {
    res.status(400);
    throw new Error("Email has already been register.");
  }

  //Hash user password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashPassword });

  // Generate token
  const token = generateToken(user._id);

  //Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        ...user._doc,
        token,
      },
    });
  } else {
    res.status(400);
    throw new Error("Unable to register user , Please try again");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Valid Request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill up all required fields.");
  }

  //Check if user exist
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }

  //Check if password is valid
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    res.status(400);
    throw new Error("Incorrect password");
  }

  //Generate Token
  const token = generateToken(user._id);

  //Send HTTP-only
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 + 86400),
    sameSite: "none",
    secure: true,
  });

  //Send Response
  if (user && checkPassword) {
    res.status(200).json({
      success: true,
      data: {
        ...user._doc,
        token,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid login credentials");
  }
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });

  return res.status(200).json({
    success: true,
    message: "Log out Successful",
  });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } else {
    res.status(400);
    throw new Error("User not found.");
  }
});

const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json(false);
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET);

  if (verified) {
    return res.json(true);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const user = await User.findByIdAndDelete(req.user._id);

    res.status(204).json({
      success: true,
      data: {
        user,
      },
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User doesn't exist");
  }

  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

  const hashToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  await new Token({
    userId: user._id,
    token: hashToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000),
  }).save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `
  <h2>Hi ${user.name}</h2>
  <p>Please use the url below to reset your password</p>
  <p>This link expires in 30 minutes</p>
  <a href=${resetLink} clicktracking=off>${resetLink}</a> 
  
  <h6>cybalife</h6>
  `;
  const subject = "Reset Email";
  const send_to = user.email;
  const send_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, send_from);

    res.status(200).json({ success: true, message: "Reset email sent." });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent , Please try Again.");
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  logout,
  loginStatus,
  forgotPassword,
};
