const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "User created.",
      data: {
        product: newProduct,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Successful",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      message: error,
    });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const product = await Product.find();

    res.status(200).json({
      success: true,
      message: "Successful",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      message: error,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated.",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      message: error,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(204).json({
      success: true,
      message: "Product deleted.",
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      message: error,
    });
  }
};
