const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const {
  createRide,
  getFare,
  confirmRide,
  startRide,
  endRide,
} = require("../controllers/rideController");
const { CaptainProtected } = require("../middleware/authMiddleware");
const { protected } = require("../middleware/authMiddleware");

// Route to create a ride (assuming normal user, so protected might be needed here)
router.post(
  "/create",
  protected, // Or `protected` if normal user route
  body("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
  body("vehicleType")
    .isString()
    .isIn(["auto", "car", "moto"])
    .withMessage("Invalid vehicle type"),
  createRide
);

// Get fare calculation (also user protected route, maybe use protected here)
router.get(
  "/get-fare",
  protected, // Or `protected` if normal user route
  query("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  query("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
  getFare
);

// Confirm ride by captain
router.post(
  "/confirm",
  CaptainProtected,
  body("rideId").isUUID().withMessage("Invalid ride id"),
  confirmRide
);

// Start ride by captain
router.get(
  "/start-ride",
  CaptainProtected,
  query("rideId").isUUID().withMessage("Invalid ride id"),
  query("otp")
    .isString()
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid OTP"),
  startRide
);

// End ride by captain
router.post(
  "/end-ride",
  CaptainProtected,
  body("rideId").isUUID().withMessage("Invalid ride id"),
  endRide
);

module.exports = router;
