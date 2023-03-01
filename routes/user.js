const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const protect = require("../middlewares/authMiddleware");

router.route("/register").post(userController.registerUser);

router.route("/login").post(userController.loginUser);

router.route("/logout").get(userController.logout);

router.route("/login-stat").get(userController.loginStatus);

router.route("/get-user").get(protect, userController.getUser);

router.route("/update-user").patch(protect, userController.updateUser);

router.route("/forgot-password").post(userController.forgotPassword);

router.route("/reset-password/:resetToken").patch(userController.resetPassword);

router.route("/delete-user").delete(userController.deleteUser);

// router
//   .route("/:id")
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
