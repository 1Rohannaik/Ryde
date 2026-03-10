const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/payment-ride", paymentController.createRidePaymentSession);

module.exports = router;
