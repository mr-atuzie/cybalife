const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const PakamUser = require("../models/Pakam");
const PakamAssessment = require("../models/Assessment");

const createUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, username, password } = req.body;

  if (!firstname || !lastname || !username || !password) {
    res.status(400);
    throw new Error("Please fill up all required fields.");
  }

  //Check password length
  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be up to 8 characters.");
  }

  const userCheck = await PakamUser.findOne({ username: username });

  if (userCheck) {
    res.status(400);
    throw new Error("username has been taken");
  }

  //Hash user password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await PakamUser.create({
    firstname,
    lastname,
    username,
    password: hashPassword,
  });

  if (user) {
    res.status(201).json(user);
  } else {
    res.status(400);
    throw new Error("Unable to register user , Please try again");
  }
});

// login
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  //Valid Request
  if (!username || !password) {
    res.status(400);
    throw new Error("Please fill up all required fields.");
  }

  //Check if user exist
  const user = await PakamUser.findOne({ username: username });

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

  //Send Response
  if (user && checkPassword) {
    res.status(200).json(user);
  } else {
    res.status(400);
    throw new Error("Invalid login credentials");
  }
});

//Assessment

const createAssessment = asyncHandler(async (req, res) => {
  const { fullname, quantity, desc } = req.body;

  if (!fullname || !quantity || !desc) {
    res.status(400);
    throw new Error("Please fill up all required fields.");
  }

  const assessment = await PakamAssessment.create({
    fullname,
    quantity,
    desc,
  });

  if (assessment) {
    res.status(201).json(assessment);
  } else {
    res.status(400);
    throw new Error("Unable to register user , Please try again");
  }
});

const getAssessment = asyncHandler(async (req, res) => {
  const assessment = await PakamAssessment.findById(req.params.id);

  if (assessment) {
    res.status(200).json(assessment);
  } else {
    res.status(400);
    throw new Error("Assessment not found.");
  }
});

const getAllAssessment = asyncHandler(async (req, res) => {
  const assessments = await PakamAssessment.find();

  res.status(200).json({ result: assessments.length, assessments });
});

const updateAssessment = asyncHandler(async (req, res) => {
  const assessment = await PakamAssessment.findById(req.params.id);

  if (assessment) {
    const newAssessment = await PakamAssessment.findByIdAndUpdate(
      assessment._id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(newAssessment);
  } else {
    res.status(400);
    throw new Error("Assessment not found");
  }
});

const deleteAssessment = asyncHandler(async (req, res) => {
  await PakamAssessment.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Assessment has been deleted",
  });
});

module.exports = {
  createUser,
  loginUser,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  getAllAssessment,
  getAssessment,
};
