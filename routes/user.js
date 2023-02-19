const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.route("/register").post(userController.createUser);

router.route("/login").post(userController.loginUser);

router.route("/logout").get(userController.logout);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
