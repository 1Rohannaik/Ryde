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
    try {
      const response = await axios.get(
        "https://api.geoapify.com/v1/geocode/search",
        {
          params: {
            text: address,
            filter: "countrycode:in",
            bias: `proximity:${LOCATION_BIAS.lon},${LOCATION_BIAS.lat}`,
            limit: 1,
            apiKey: process.env.GEOAPIFY_API_KEY,
          },
          timeout: 8000,
        }
      );

      if (!response.data || !response.data.features || response.data.features.length === 0) {
        throw new Error("Address not found");
      }

      const { lat, lon } = response.data.features[0].properties;
      return {
        lat: parseFloat(lat),
        lng: parseFloat(lon),
      };
    } catch (error) {
      console.error("❌ Error in getAddressCoordinate:", error.message);
      throw error;
    }
  },

  // 🧮 Haversine distance calculation (fallback when ORS fails)
  _haversineDistance: (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  // 🚗 Get distance and time using OpenRouteService (with Haversine fallback)
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

      try {
        const response = await axios.post(
          "https://api.openrouteservice.org/v2/directions/driving-car",
          { coordinates },
          {
            headers: {
              Authorization: process.env.ORS_API_KEY,
              "Content-Type": "application/json",
            },
            timeout: 10000, // 10 second timeout
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
      } catch (orsError) {
        // ORS failed — use Haversine fallback
        console.warn(
          "⚠️ ORS API failed, using Haversine fallback:",
          orsError.response?.data?.error?.message || orsError.message
        );

        const haversineKm = module.exports._haversineDistance(
          startLat, startLng, endLat, endLng
        );
        // Approximate road distance is ~1.3x haversine, assume avg 30km/h city speed
        const roadDistance = (haversineKm * 1.3).toFixed(2);
        const durationMin = ((haversineKm * 1.3) / 30 * 60).toFixed(2);

        console.log("📏 Haversine fallback distance (km):", roadDistance);
        console.log("⏱ Haversine fallback duration (min):", durationMin);

        return {
          distance: roadDistance,
          duration: durationMin,
        };
      }
    } catch (error) {
      console.error(
        "❌ Error in getDistanceTime:",
        error.response?.data || error.message
      );
      throw new Error("Failed to fetch distance and duration");
    }
  },

  // 🗺 Get route polyline (with straight-line fallback)
  getRoutePolyline: async (originStr, destinationStr) => {
    try {
      const [startLat, startLng] = originStr.split(",").map(Number);
      const [endLat, endLng] = destinationStr.split(",").map(Number);

      if (isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng)) {
        throw new Error("Invalid coordinates provided");
      }

      if (originStr === destinationStr) {
        return [[startLat, startLng], [endLat, endLng]];
      }

      const coordinates = [
        [startLng, startLat],
        [endLng, endLat],
      ];

      try {
        const response = await axios.post(
          "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
          { coordinates },
          {
            headers: {
              Authorization: process.env.ORS_API_KEY,
              "Content-Type": "application/json",
            },
            timeout: 10000, // 10 second timeout
          }
        );

        if (!response.data || !response.data.features || response.data.features.length === 0) {
          throw new Error("No route found");
        }

        // GeoJSON paths are [longitude, latitude], Leaflet needs [latitude, longitude]
        const coords = response.data.features[0].geometry.coordinates;
        const polyline = coords.map((coord) => [coord[1], coord[0]]);
        
        return polyline;
      } catch (orsError) {
        // ORS failed — return a straight line fallback
        console.warn(
          "⚠️ ORS route API failed, returning straight-line fallback:",
          orsError.response?.data?.error?.message || orsError.message
        );

        // Return a simple straight line between the two points
        return [[startLat, startLng], [endLat, endLng]];
      }
    } catch (error) {
      console.error("❌ Error in getRoutePolyline:", error.response?.data || error.message);
      throw new Error("Failed to fetch route polyline");
    }
  },

  // 🔍 Autocomplete suggestions using Geoapify API
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

    try {
      const response = await axios.get(
        "https://api.geoapify.com/v1/geocode/autocomplete",
        {
          params: {
            text: input,
            limit: 5,
            filter: "countrycode:in",
            bias: `proximity:${LOCATION_BIAS.lon},${LOCATION_BIAS.lat}`,
            apiKey: process.env.GEOAPIFY_API_KEY,
          },
          timeout: 8000,
        }
      );

      if (!response.data || !response.data.features) {
        return [];
      }

      const suggestions = response.data.features
        .map((feature) => {
          const p = feature.properties;
          return {
            name: p.name || p.address_line1 || "",
            formatted_address: p.formatted || "",
            lat: p.lat,
            lon: p.lon,
          };
        })
        .filter((s) => s.name && s.lat && s.lon);

      // Store in simple cache
      autocompleteCache.set(cacheKey, {
        data: suggestions,
        timestamp: Date.now(),
      });

      return suggestions;
    } catch (err) {
      console.error("❌ Error in getAutoCompleteSuggestions:", err.message);
      return []; // Always return empty array on error to avoid crashing the UI
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
