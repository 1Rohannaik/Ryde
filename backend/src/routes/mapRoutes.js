const express = require("express");
const { query } = require("express-validator");
const {
  getCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestions,
} = require("../controllers/mapController");
const {protected} = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/maps/coordinates?address=SomeAddress
router.get(
  "/coordinates",
  protected,
  [query("address").notEmpty().withMessage("Address is required")],
  getCoordinates
);

// GET /api/maps/distance?origin=lat1,lng1&destination=lat2,lng2
router.get(
  "/distance",
  protected,
  [
    query("origin").notEmpty().withMessage("Origin is required"),
    query("destination").notEmpty().withMessage("Destination is required"),
  ],
  getDistanceTime
);

// GET /api/maps/autocomplete?input=somequery
router.get(
  "/autocomplete",
  protected,
  [query("input").notEmpty().withMessage("Search input is required")],
  getAutoCompleteSuggestions
);

module.exports = router;
