const mapService = require("../../services/mapService");
const { validationResult } = require("express-validator");

const getCoordinates = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.query;

  try {
    const coordinates = await mapService.getAddressCoordinate(address);
    res.status(200).json(coordinates);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Coordinates not found" });
  }
};

const getDistanceTime = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { origin, destination } = req.query;

  try {
    const distanceTime = await mapService.getDistanceTime(origin, destination);
    res.status(200).json(distanceTime);
  } catch (err) {
    console.error("Error in getDistanceTime:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAutoCompleteSuggestions = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { input } = req.query;

  try {
    const suggestions = await mapService.getAutoCompleteSuggestions(input);
    res.status(200).json(suggestions);
  } catch (err) {
    console.error("Error in getAutoCompleteSuggestions:", err.message);
<<<<<<< HEAD
    res.status(200).json([]); // Fallback to empty array on rate limits
  }
};

const getRoute = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { origin, destination } = req.query;

  try {
    const polyline = await mapService.getRoutePolyline(origin, destination);
    res.status(200).json(polyline);
  } catch (err) {
    console.error("Error in getRoute:", err.message);
    res.status(500).json({ message: "Internal server error fetching route" });
=======
    res.status(500).json({ message: "Internal server error" });
>>>>>>> 3cc71708bb7c79229436d7a537c5f06d411d5bed
  }
};

module.exports = {
  getCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestions,
<<<<<<< HEAD
  getRoute,
=======
>>>>>>> 3cc71708bb7c79229436d7a537c5f06d411d5bed
};
