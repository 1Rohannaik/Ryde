const axios = require("axios");
const captainModel = require("../src/model/captainModel");
const sequelize = require("../lib/db");
const { QueryTypes } = require("sequelize");
require("dotenv").config();

module.exports = {
  // 📍 Get coordinates from address using Nominatim
  getAddressCoordinate: async (address) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

    try {
      const response = await axios.get(url, {
        headers: { "User-Agent": "SheRyde-App" },
      });

      if (!response.data || response.data.length === 0) {
        throw new Error("Address not found");
      }

      const place = response.data[0];
      return {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
      };
    } catch (error) {
      console.error("❌ Error in getAddressCoordinate:", error.message);
      throw error;
    }
  },

  // 🚗 Get distance and time using OpenRouteService
  getDistanceTime: async (originStr, destinationStr) => {
    try {
      console.log("📦 Origin:", originStr);
      console.log("📦 Destination:", destinationStr);

      const [startLat, startLng] = originStr.split(",").map(Number);
      const [endLat, endLng] = destinationStr.split(",").map(Number);

      if (
        isNaN(startLat) ||
        isNaN(startLng) ||
        isNaN(endLat) ||
        isNaN(endLng)
      ) {
        throw new Error("Invalid coordinates provided");
      }

      // Check if pickup and destination are same
      if (originStr === destinationStr) {
        console.warn(
          "⚠️ Pickup and destination are the same. Returning default values."
        );
        return {
          distance: 0.1,
          duration: 1,
        };
      }

      const coordinates = [
        [startLng, startLat],
        [endLng, endLat],
      ];

      console.log("📍 Sending coordinates to ORS:", coordinates);

      const response = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car",
        { coordinates },
        {
          headers: {
            Authorization: process.env.ORS_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const { routes } = response.data;

      if (!routes || routes.length === 0) {
        throw new Error("No routes found in ORS response");
      }

      const summary = routes[0].summary;

      if (!summary) {
        throw new Error("No summary found in ORS response");
      }

      console.log("📏 Distance (m):", summary.distance);
      console.log("⏱ Duration (s):", summary.duration);

      return {
        distance: (summary.distance / 1000).toFixed(2), // in km
        duration: (summary.duration / 60).toFixed(2), // in minutes
      };
    } catch (error) {
      console.error(
        "❌ Error in getDistanceTime:",
        error.response?.data || error.message
      );
      throw new Error("Failed to fetch distance and duration");
    }
  },

  // 🔍 Autocomplete suggestions for places
  getAutoCompleteSuggestions: async (input) => {
    if (!input) throw new Error("Query is required");

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      input
    )}&format=json&addressdetails=1&limit=5`;

    try {
      const response = await axios.get(url, {
        headers: { "User-Agent": "SheRyde/1.0" },
      });

      return response.data.map((place) => place.display_name);
    } catch (err) {
      console.error("❌ Error in getAutoCompleteSuggestions:", err.message);
      throw err;
    }
  },

  // 🧭 Get nearby captains using raw SQL and distance formula
getCaptainsInTheRadius: async (lat, lng, radius) => {
  const earthRadius = 6371;

  const query = `
    SELECT * FROM (
      SELECT *, (
        ${earthRadius} * ACOS(
          COS(RADIANS(:lat)) * COS(RADIANS(ltd)) * COS(RADIANS(lng) - RADIANS(:lng)) +
          SIN(RADIANS(:lat)) * SIN(RADIANS(ltd))
        )
      ) AS distance
      FROM Captains
    ) AS nearby
    WHERE distance <= :radius
    ORDER BY distance ASC;
  `;

  try {
    const results = await sequelize.query(query, {
      replacements: { lat, lng, radius },
      type: QueryTypes.SELECT,
    });

    console.log("📍 Nearby captains found:", results);
    return results;
  } catch (error) {
    console.error("❌ Error in getCaptainsInTheRadius:", error.message);
    throw error;
  }
}

};
