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
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestions,
};
