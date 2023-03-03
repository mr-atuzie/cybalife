const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const protect = require("../middlewares/authMiddleware");

router
  .route("/")
  .post(protect, productController.createProduct)
  .get(productController.getAllProduct);

router.route("/my-products").get(protect, productController.getAllUserProduct);

router
  .route("/:id")
  .get(protect, productController.getProduct)
  .patch(protect, productController.updateProduct)
  .delete(protect, productController.deleteProduct);

module.exports = router;
