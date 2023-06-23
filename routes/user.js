const express = require("express");
const userController = require("../controllers/user");
const protect = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/register").post(userController.createUser);

router.route("/login").post(userController.loginUser);

router.route("/logout").get(userController.logout);

router.route("/get-user").get(protect, userController.getUser);

router.route("/login-status").get(protect, userController.loginStatus);

router.route("/update-user").patch(protect, userController.updateUser);

router.route("/delete-user").delete(userController.deleteUser);

router.route("/forgot-password").post(userController.forgotPassword);

router.route("/reset-password/:resetToken").patch(userController.resetPassword);

module.exports = router;
