const express = require("express");
const router = express.Router();

const medicalController = require("../controllers/medical");

router.route("/register").post(medicalController.createMedical);

router.route("/login").post(medicalController.loginMedical);

router.route("/logout").get(medicalController.logout);

router
  .route("/:id")
  .get(medicalController.getMedical)
  .patch(medicalController.updateMedical)
  .delete(medicalController.deleteMedical);

module.exports = router;
