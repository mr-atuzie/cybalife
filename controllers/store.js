const Store = require("../models/Store");

exports.createStore = async (req, res) => {
  try {
    const newStore = await Store.create(req.body);

    res.status(201).json({
      success: true,
      message: "Store created.",
      data: {
        store: newStore,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

exports.getStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Successful",
      store,
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      message: error,
    });
  }
};

exports.getAllStore = async (req, res) => {
  try {
    const store = await Store.find();

    res.status(200).json({
      success: true,
      message: "Successful",
      store,
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      message: error,
    });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Store updated.",
      store,
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      message: error,
    });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    await Store.findByIdAndDelete(req.params.id);

    res.status(204).json({
      success: true,
      message: "Store deleted.",
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      message: error,
    });
  }
};
