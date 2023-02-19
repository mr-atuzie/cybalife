const express = require("express");
const router = express.Router();

const storeController = require("../controllers/store");

router
  .route("/")
  .post(storeController.createStore)
  .get(storeController.getAllStore);

router
  .route("/:id")
  .get(storeController.getStore)
  .patch(storeController.updateStore)
  .delete(storeController.deleteStore);

module.exports = router;
