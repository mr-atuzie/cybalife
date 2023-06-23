const express = require("express");
const router = express.Router();
const houseController = require("../controllers/house");
const protect = require("../middlewares/authMiddleware");
const { upload } = require("../utils/fileUpload");

router
  .route("/")
  .post(protect, upload.single("image"), houseController.addHouse)
  .get(houseController.getAllHouses);

router.route("/my-products").get(protect, houseController.getAllUserListing);

router
  .route("/:id")
  .get(protect, houseController.getHouse)
  .delete(protect, houseController.removeHouse);

router
  .route("/")
  .patch(protect, upload.single("image"), houseController.updateHouse);

module.exports = router;
