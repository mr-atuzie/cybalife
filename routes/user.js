const express = require("express");
const userController = require("../controllers/user");
const protect = require("../middlewares/authMiddleware");
const { upload } = require("../utils/fileUpload");
const router = express.Router();

router.route("/register").post(userController.createUser);

router.route("/login").post(userController.loginUser);

router.route("/add-guarantor").put(protect, userController.addGuarantor);

router.route("/add-nextOfKin").put(protect, userController.addNextOfKin);

router
  .route("/add-document")
  .put(protect, upload.single("image"), userController.addDocument);

router.route("/logout").get(userController.logout);

router.route("/my-account").get(protect, userController.getUser);

router.route("/get-user/:id").get(protect, userController.getUserById);

router.route("/get-chats/:id").get(protect, userController.getChats);

router.route("/login-status").get(userController.loginStatus);

router.route("/update-user").patch(protect, userController.updateUser);

router.route("/delete-user").delete(userController.deleteUser);

router.route("/forgot-password").post(userController.forgotPassword);

router.route("/reset-password/:resetToken").patch(userController.resetPassword);

module.exports = router;
