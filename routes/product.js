const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const protect = require("../middlewares/authMiddleware");
const { upload } = require("../utils/fileUpload");
upload;

router
  .route("/")
  .post(protect, upload.single("image"), productController.createProduct)
  .get(productController.getAllProduct);

router.route("/my-products").get(protect, productController.getAllUserProduct);

router
  .route("/:id")
  .get(protect, productController.getProduct)
  .delete(protect, productController.deleteProduct);

router
  .route("/")
  .patch(protect, upload.single("image"), productController.updateProduct);

module.exports = router;
