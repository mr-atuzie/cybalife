const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");

const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  if (!name || !sku || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  const product = await Product.create({
    user: req.user._id,
    name,
    sku,
    category,
    quantity,
    description,
  });

  if (product) {
    res.status(201).json({
      success: true,
      data: {
        product,
      },
    });
  } else {
    res.status(400);
    throw new Error("Product wasn't created. Please try again");
  }
});

const getProduct = asyncHandler(async (req, res) => {
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
});

const getAllProduct = asyncHandler(async (req, res) => {
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
});

const updateProduct = asyncHandler(async (req, res) => {
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
});

const deleteProduct = asyncHandler(async (req, res) => {
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
});

module.exports = {
  createProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
