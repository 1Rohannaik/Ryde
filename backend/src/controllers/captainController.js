const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Captain = require("../model/captainModel");
const BlacklistToken = require("../model/blacklistTokenModel");
const { generateCaptainTokenAndSetCookie } = require("../../lib/utils");

// Sign Up
const captainSignup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstname,
      lastname,
      email,
      password,
      vehicleColor,
      vehiclePlate,
      vehicleCapacity,
      vehicleType,
    } = req.body;

    const existing = await Captain.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await Captain.hashPassword(password);

    const captain = await Captain.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      vehicleColor,
      vehiclePlate,
      vehicleCapacity,
      vehicleType,
    });

    generateCaptainTokenAndSetCookie(captain, res);

    res
      .status(201)
      .json({ message: "captain registered successfully", captain });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login
const captainLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const captain = await Captain.findOne({ where: { email } });

    if (!captain) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    generateCaptainTokenAndSetCookie(captain, res);

    res.status(200).json({ message: "Logged in successfully", captain });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Logout
const captainLogout = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.decode(token);
      const expiresAt =
        decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;

      await BlacklistToken.create({ token, expiresAt });
      res.clearCookie("token");
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Profile
const captainProfile = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const captain = await Captain.findByPk(req.user.id);
    if (!captain) return res.status(404).json({ error: "Captain not found" });

    res.json({
      id: captain.id,
      fullName: `${captain.firstname} ${captain.lastname || ""}`.trim(),
      email: captain.email,
      vehicleColor: captain.vehicleColor,
      vehiclePlate: captain.vehiclePlate,
      vehicleCapacity: captain.vehicleCapacity,
      vehicleType: captain.vehicleType,
      profileImage: captain.profileImage || null,
    });
  } catch (error) {
    console.error("Captain profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
};


const uploadCaptainProfileImage = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const imageUrl = req.file.path;

    const captain = await Captain.findByPk(req.user.id);
    if (!captain) return res.status(404).json({ message: "Captain not found" });

    captain.profileImage = imageUrl;
    await captain.save();

    res.status(200).json({
      message: "Profile image uploaded successfully",
      imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
};


// Check Auth
const captainCheckAuth = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const fullName = `${req.user.firstname} ${req.user.lastname || ""}`.trim();

  res.status(200).json({
    id: req.user.id,
    fullName,
    email: req.user.email,
  });
};


module.exports = {
  captainSignup,
  captainLogin,
  captainLogout,
  captainProfile,
  captainCheckAuth,
  uploadCaptainProfileImage,
};
