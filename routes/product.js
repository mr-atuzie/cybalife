const express = require("express");
const router = express.Router();

const productController = require("../controllers/product");

const protect = require("../middlewares/authMiddleware");

router
  .route("/")
  .post(protect, productController.createProduct)
  .get(productController.getAllProduct);

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
