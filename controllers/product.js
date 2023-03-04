const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  if (!name || !sku || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  let fileData = {};
  if (req.file) {
    let uploadedFile;

    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Cybalife",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Unable to upload image, Please try again.");
    }
    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size),
    };
  }

  const product = await Product.create({
    user: req.user._id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
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
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  res.status(200).json({
    success: true,
    data: {
      product,
    },
  });
});

const getAllProduct = asyncHandler(async (req, res) => {
  const products = await Product.find().sort("-createdAt");

  res.status(200).json({
    success: true,
    result: products.length,
    data: {
      products,
    },
  });
});

const getAllUserProduct = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user.id }).sort("-createdAt");

  res.status(200).json({
    success: true,
    result: products.length,
    data: {
      products,
    },
  });
});

const updateProduct = asyncHandler(async (req, res) => {

  const { name, sku, category, quantity, price, description } = req.body;
  
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  const newProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    success: true,
    data: {
      product: newProduct,
    },
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(204).json({
    success: true,
    message: "Product deleted.",
  });
});

const contactUs = asyncHandler(async (req, res) => {});

module.exports = {
  createProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllUserProduct,
  contactUs,
};
