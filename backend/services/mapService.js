const axios = require("axios");
const captainModel = require("../src/model/captainModel");
const sequelize = require("../lib/db");
const { QueryTypes } = require("sequelize");
require("dotenv").config();

const USER_AGENT = "Ryde/1.0 (rohannaik2299@gmail.com)";

// 💡 Simple In-Memory Cache for Autocomplete
const autocompleteCache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 Hour

// 📍 Location bias for Photon API (centered on Bangalore, India)
const LOCATION_BIAS = { lat: 12.9716, lon: 77.5946 };

module.exports = {
  getAddressCoordinate: async (address) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://photon.komoot.io/api/?q=${encodedAddress}&limit=1&lat=${LOCATION_BIAS.lat}&lon=${LOCATION_BIAS.lon}`;

    try {
      const response = await axios.get(url, {
        headers: { "User-Agent": USER_AGENT },
      });

      if (!response.data || !response.data.features || response.data.features.length === 0) {
        throw new Error("Address not found");
      }

      const feature = response.data.features[0];
      const [lng, lat] = feature.geometry.coordinates;
      return {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
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

  // 🗺 Get route polyline logic
  getRoutePolyline: async (originStr, destinationStr) => {
    try {
      const [startLat, startLng] = originStr.split(",").map(Number);
      const [endLat, endLng] = destinationStr.split(",").map(Number);

      if (isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng)) {
        throw new Error("Invalid coordinates provided");
      }

      if (originStr === destinationStr) {
        return [[[startLat, startLng], [endLat, endLng]]];
      }

      const coordinates = [
        [startLng, startLat],
        [endLng, endLat],
      ];

      const response = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        { coordinates },
        {
          headers: {
            Authorization: process.env.ORS_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data || !response.data.features || response.data.features.length === 0) {
        throw new Error("No route found");
      }

      // GeoJSON paths are [longitude, latitude], Leaflet needs [latitude, longitude]
      const coords = response.data.features[0].geometry.coordinates;
      const polyline = coords.map((coord) => [coord[1], coord[0]]);
      
      return polyline;
    } catch (error) {
      console.error("❌ Error in getRoutePolyline:", error.response?.data || error.message);
      throw new Error("Failed to fetch route polyline");
    }
  },

  // 🔍 Autocomplete suggestions for places
  getAutoCompleteSuggestions: async (input) => {
    if (!input) throw new Error("Query is required");

    // Check cache first
    const cacheKey = input.toLowerCase().trim();
    if (autocompleteCache.has(cacheKey)) {
      const cached = autocompleteCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`⚡ Serving autocomplete from cache for: ${input}`);
        return cached.data;
      } else {
        autocompleteCache.delete(cacheKey); // clear expired
      }
    }

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
      input
    )}&limit=5&lat=${LOCATION_BIAS.lat}&lon=${LOCATION_BIAS.lon}`;

    try {
      const response = await axios.get(url, {
        headers: { "User-Agent": USER_AGENT },
      });
      
      const suggestions = response.data.features.map((feature) => {
        const p = feature.properties;
        const parts = [p.name, p.street, p.city, p.state, p.country].filter(Boolean);
        return [...new Set(parts)].join(", ");
      });

      // Store in simple cache
      autocompleteCache.set(cacheKey, {
        data: suggestions,
        timestamp: Date.now(),
      });

      return suggestions;
    } catch (err) {
      console.error("❌ Error in getAutoCompleteSuggestions:", err.message);
      // Fallback for API limits/errors. Instead of 500, return empty array to UI gracefully.
      if (err.response && (err.response.status === 403 || err.response.status === 429)) {
         return [];
      }
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
  },
};
