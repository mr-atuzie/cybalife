const House = require("../models/House");
const asyncHandler = require("express-async-handler");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

const addHouse = asyncHandler(async (req, res) => {
  const { name, category, quantity, price, description, numberOfRoom } =
    req.body;

  if (
    !name ||
    !numberOfRoom ||
    !category ||
    !quantity ||
    !price ||
    !description
  ) {
    res.status(400);
    throw new Error("Please fill in all fields");
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

  const product = await House.create({
    user: req.user._id,
    name,
    numberOfRoom,
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

const getHouse = asyncHandler(async (req, res) => {
  const product = await House.findById(req.params.id);

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

const getAllHouses = asyncHandler(async (req, res) => {
  const products = await House.find().sort("-createdAt");

  res.status(200).json({
    success: true,
    result: products.length,
    data: {
      products,
    },
  });
});

const getAllUserListing = asyncHandler(async (req, res) => {
  const products = await House.find({ user: req.user.id }).sort("-createdAt");

  res.status(200).json({
    success: true,
    result: products.length,
    data: {
      products,
    },
  });
});

const updateHouse = asyncHandler(async (req, res) => {
  const product = await House.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  const newProduct = await House.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    success: true,
    data: {
      product: newProduct,
    },
  });
});

const removeHouse = asyncHandler(async (req, res) => {
  const product = await House.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  await House.findByIdAndDelete(req.params.id);

  res.status(204).json({
    success: true,
    message: "House has been removed from listing",
  });
});

module.exports = {
  addHouse,
  getHouse,
  getAllHouses,
  getAllUserListing,
  updateHouse,
  removeHouse,
};
