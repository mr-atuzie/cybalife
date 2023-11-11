const House = require("../models/House");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { fileSizeFormatter } = require("../utils/fileUpload");
const Notification = require("../models/Notification");
const cloudinary = require("cloudinary").v2;

const addHouse = asyncHandler(async (req, res) => {
  const {
    price,
    address,
    propertyType,
    buildingType,
    yearBuilt,
    lotSize,
    propertySize,
    numberOfFullBathrooms,
    numberOfPartialBathrooms,
    numberOfBedrooms,
    desc,
    electricBill,
    wasteBill,
    waterBill,
    type,
    windows,
    unit,
    leasePeriod,
  } = req.body;

  if (
    !address ||
    !type ||
    !price ||
    !propertyType ||
    !buildingType ||
    !yearBuilt ||
    !lotSize ||
    !propertySize ||
    !numberOfBedrooms ||
    !numberOfPartialBathrooms ||
    !numberOfFullBathrooms ||
    !electricBill ||
    !wasteBill ||
    !waterBill ||
    !desc
  ) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  // console.log(price, address);

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
    price,
    address,
    propertyType,
    buildingType,
    yearBuilt,
    lotSize,
    propertySize,
    numberOfFullBathrooms,
    numberOfPartialBathrooms,
    numberOfBedrooms,
    desc,
    electricBill,
    wasteBill,
    waterBill,
    image: fileData,
    windows,
    type,
    unit,
    leasePeriod,
  });

  if (product) {
    await Notification.create({
      userId: req.user._id,
      name: req.user.name,
      photo: req.user.photo,
    });
    //create notification

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

  res.status(200).json(product);
});

const getAllHouses = asyncHandler(async (req, res) => {
  const products = await House.find().sort("-createdAt");

  res.status(200).json({
    result: products.length,
    houses: products,
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

const reserveHouse = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const product = await House.findById(id);

  const user = await User.findById(req.user.id);

  const reserve = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: { reserved: [...user.reserved, product] },
    },
    { new: true }
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json(reserve);
});

const saveHouse = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const product = await House.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const user = await User.findById(req.user.id);

  const saved = user.saved;

  const existingHouse = saved.filter((item) => item._id === id);

  res.status(200).json({ existingHouse });

  // if (!existingHouse) {
  // const updatesaved = await User.findByIdAndUpdate(
  //   req.user.id,
  //   {
  //     $set: { saved: [...user.saved, product] },
  //   },
  //   { new: true }
  // );
  // res.status(200).json({ updatesaved });
  // } else {
  //   res.status(200).json("producted already saved");
  // }
});

const getReservedHouse = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("user doesn't exist");
  }

  res.status(200).json({ reserved: user.reserved });
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

const filterPropertyType = asyncHandler(async (req, res) => {
  const { type } = req.params;

  // res.send(houseType);

  if (!type) {
    res.status(404);
    throw new Error("Unable to valid this request");
  }

  const houses = await House.find({
    propertyType: type,
  });

  res.status(200).json({
    result: houses.length,
    houses,
  });
});

const getNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.find();

  res.status(200).json({
    result: notification.length,
    notification,
  });
});

const reviewHouse = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  const product = await House.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  if (!rating || !comment) {
    res.status(404);
    throw new Error("Please fill in all fields");
  }

  const review = {
    by: user.name,
    rating,
    comment,
  };

  const newProduct = await House.findByIdAndUpdate(
    req.params.id,
    { $set: { reviews: [...product.reviews, review] } },
    {
      new: true,
    }
  );

  res.status(200).json(newProduct);
});

module.exports = {
  addHouse,
  getHouse,
  getAllHouses,
  getNotification,
  getAllUserListing,
  filterPropertyType,
  updateHouse,
  removeHouse,
  reserveHouse,
  getReservedHouse,
  saveHouse,
  reviewHouse,
};
