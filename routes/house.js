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

router.route("/filter-houses").get(protect, houseController.filterPropertyType);

router.route("/notification").get(protect, houseController.getNotification);

router.route("/reserved").get(protect, houseController.reserved);

router
  .route("/:id")
  .get(protect, houseController.getHouse)
  .delete(protect, houseController.removeHouse);

router
  .route("/")
  .patch(protect, upload.single("image"), houseController.updateHouse);

router.route("/reserve-house").patch(protect, houseController.reserveHouse);

router.route("/save-house").patch(protect, houseController.saveHouse);

module.exports = router;
