const express = require("express");
const pakamController = require("../controllers/pakam");
const router = express.Router();

router.route("/register").post(pakamController.createUser);
router.route("/login").post(pakamController.loginUser);

router.route("/create-assessment").post(pakamController.createAssessment);
router.route("/get-assessment/:id").get(pakamController.getAssessment);
router.route("/get-assessments").get(pakamController.getAllAssessment);
router.route("/update-assessment/:id").patch(pakamController.updateAssessment);
router.route("/delete-assessment/:id").delete(pakamController.deleteAssessment);

module.exports = router;
