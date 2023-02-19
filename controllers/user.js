const User = require("../models/User");

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      success: true,
      message: "User created.",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    if (password !== user.password) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    res.status(201).json({
      success: true,
      message: "Login successful.",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Successful",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      message: error,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "User updated.",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      message: error,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(204).json({
      success: true,
      message: "User deleted.",
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      message: error,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.send("logout");
  } catch (error) {
    res.status(400).json({
      success: true,
      message: error,
    });
  }
};
