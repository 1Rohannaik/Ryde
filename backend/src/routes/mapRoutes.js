const express = require("express");
const { query } = require("express-validator");
const {
  getCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestions,
<<<<<<< HEAD
  getRoute,
} = require("../controllers/mapController");
const { authUserOrCaptain } = require("../middleware/authMiddleware");
=======
} = require("../controllers/mapController");
const {protected} = require("../middleware/authMiddleware");
>>>>>>> 3cc71708bb7c79229436d7a537c5f06d411d5bed

const router = express.Router();

// GET /api/maps/coordinates?address=SomeAddress
router.get(
  "/coordinates",
<<<<<<< HEAD
  authUserOrCaptain,
=======
  protected,
>>>>>>> 3cc71708bb7c79229436d7a537c5f06d411d5bed
  [query("address").notEmpty().withMessage("Address is required")],
  getCoordinates
);

// GET /api/maps/distance?origin=lat1,lng1&destination=lat2,lng2
router.get(
  "/distance",
<<<<<<< HEAD
  authUserOrCaptain,
=======
  protected,
>>>>>>> 3cc71708bb7c79229436d7a537c5f06d411d5bed
  [
    query("origin").notEmpty().withMessage("Origin is required"),
    query("destination").notEmpty().withMessage("Destination is required"),
  ],
  getDistanceTime
);

// GET /api/maps/autocomplete?input=somequery
router.get(
  "/autocomplete",
<<<<<<< HEAD
  authUserOrCaptain,
=======
  protected,
>>>>>>> 3cc71708bb7c79229436d7a537c5f06d411d5bed
  [query("input").notEmpty().withMessage("Search input is required")],
  getAutoCompleteSuggestions
);

<<<<<<< HEAD
// GET /api/maps/route?origin=lat1,lng1&destination=lat2,lng2
router.get(
  "/route",
  authUserOrCaptain,
  [
    query("origin").notEmpty().withMessage("Origin is required"),
    query("destination").notEmpty().withMessage("Destination is required"),
  ],
  getRoute
);

=======
>>>>>>> 3cc71708bb7c79229436d7a537c5f06d411d5bed
module.exports = router;
