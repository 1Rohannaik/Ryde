const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post(
  "/payment-ride",
  paymentController.createCheckoutSession
);

module.exports = router;
