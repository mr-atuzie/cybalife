const Medical = require("../models/Medical");

exports.createMedical = async (req, res) => {
  try {
    const newUser = await Medical.create(req.body);

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

exports.loginMedical = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Medical.findOne({ email });

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

exports.getMedical = async (req, res) => {
  try {
    const user = await Medical.findById(req.params.id);

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

exports.updateMedical = async (req, res) => {
  try {
    const user = await Medical.findByIdAndUpdate(req.params.id, req.body, {
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

exports.deleteMedical = async (req, res) => {
  try {
    await Medical.findByIdAndDelete(req.params.id);

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
