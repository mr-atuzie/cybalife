const User = require("../models/User");
const Token = require("../models/Token");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

const sendEmail = require("../utils/sendEmail");
const Message = require("../models/Message");
const Chats = require("../models/Chats");

const generateToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET);
};

const createUser = asyncHandler(async (req, res) => {
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

  const user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  // Generate token
  const token = generateToken(user._id, user.name);

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
      ...user._doc,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Unable to register user , Please try again");
  }
});

// login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Valid Request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill up all required fields.");
  }

  //Check if user exist
  const user = await User.findOne({ email: email });

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
  const token = generateToken(user._id, user.name);

  //Send HTTP-only
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  //Send Response
  if (user && checkPassword) {
    res.status(200).json({
      ...user._doc,
      token,
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
    res.status(200).json(user);
  } else {
    res.status(400);
    throw new Error("User not found.");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(400);
    throw new Error("User not found.");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });

    res.status(200).json({
      user,
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

  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
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
  const subject = "Password Reset Request";
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

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  const hashToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const userToken = await Token.findOne({
    token: hashToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token.");
  }

  //Hash user password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await User.findOne({ _id: userToken.userId });
  user.password = hashPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful, Please login.",
  });
});

const addGuarantor = asyncHandler(async (req, res) => {
  const { name, email, phone, occupation, address } = req.body;

  if (!name || !email || !phone || !occupation || !address) {
    res.status(400);
    throw new Error("Please fill up all required fields.");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { gurantor: { name, email, phone, occupation, address } } },
    {
      new: true,
    }
  );

  res.status(200).json(user);
});

const addNextOfKin = asyncHandler(async (req, res) => {
  const { name, email, phone, relationship } = req.body;

  if (!name || !email || !phone || !relationship) {
    res.status(400);
    throw new Error("Please fill up all required fields.");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { nextOfKin: { name, email, phone, relationship } } },
    {
      new: true,
    }
  );

  res.status(200).json(user);
});

const addDocument = asyncHandler(async (req, res) => {
  const { idType, idNumber } = req.body;

  if (!idType || !idNumber) {
    res.status(400);
    throw new Error("Please fill up all required fields.");
  }

  let fileData = {};
  if (req.file) {
    let uploadedFile;

    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Houses",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      res.send(error);
      throw new Error("Unable to upload image, Please try again.");
    }
    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size),
    };
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { document: { idType, idNumber, image: fileData } } },
    {
      new: true,
    }
  );

  res.status(200).json(user);
});

const uploadPicture = asyncHandler(async (req, res) => {
  let fileData = {};

  if (req.file) {
    let uploadedFile;

    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Houses",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      res.send(error);
      throw new Error("Unable to upload image, Please try again.");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size),
    };
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { photo: fileData.filePath } },
    {
      new: true,
    }
  );

  res.status(200).json(user);
});

const sendChat = asyncHandler(async (req, res) => {
  const { recipient, text } = req.body;

  const user = await User.findById(req.user._id);
  const to = await User.findById(recipient);

  //validate req
  if (!recipient || !text) {
    res.status(400);
    throw new Error("all  fields are required ");
  }

  // create message
  await Message.create({
    sender: user._id,
    recipient,
    text,
  });

  //check if chat doc exist
  const chatDoc = await Chats.findOne({ recipient });

  //!chatdoc. create one
  if (!chatDoc) {
    await Chats.create({
      userId: user._id,
      recipient: to._id,
      LastMessage: text,
      photo: to.photo,
      name: to.name,
    });
  }

  // if there's chat , update last message
  if (chatDoc) {
    await Chats.findOneAndUpdate(
      { recipient: to._id },
      { $set: { LastMessage: text } }
    );
  }

  res.status(200).json("message sent.");
});

const getChats = asyncHandler(async (req, res) => {
  const products = await Chats.find({
    $or: [{ userId: req.user._id }, { recipient: req.user._id }],
  }).sort("-createdAt");

  res.status(200).json(products);
});

const getMsgs = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);

  const messages = await Message.find({
    sender: { $in: [id, user._id] },
    recipient: { $in: [id, user._id] },
  }).sort({ createdAt: 1 });

  res.status(200).json(messages);
});

module.exports = {
  createUser,
  loginUser,
  logout,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  loginStatus,
  addGuarantor,
  addNextOfKin,
  addDocument,
  getChats,
  sendChat,
  uploadPicture,
  getMsgs,
};
