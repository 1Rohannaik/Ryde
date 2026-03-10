const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const BlacklistToken = require("../model/blacklistTokenModel");
const userService = require("../../services/userService");
const { generateTokenAndSetCookie } = require("../../lib/utils");

// Signup
const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { firstname, lastname, email, password } = req.body;

  try {
    const exists = await User.findOne({ where: { email } });
    if (exists)
      return res.status(409).json({ message: "Email already registered" });

    const user = await userService.createUser({
      firstname,
      lastname,
      email,
      password,
    });

    generateTokenAndSetCookie(user, res);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ message: "Invalid credentials" });

    generateTokenAndSetCookie(user, res); // set cookie only

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to get profile" });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    // `req.file.path` will contain the Cloudinary image URL
    const imageUrl = req.file.path;

    // Update user's profileImage in DB
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profileImage = imageUrl;
    await user.save();

    res.status(200).json({
      message: "Profile image uploaded successfully",
      imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(200).json({ message: "Already logged out" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await BlacklistToken.create({
      token,
      expiresAt: new Date(decoded.exp * 1000),
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err.message);
    res.clearCookie("token");
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Check Auth
const checkAuth = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.status(200).json({
    id: req.user.id,
    fullName: req.user.fullName,
    email: req.user.email,
  });
};

module.exports = {
  signup,
  login,
  getUserProfile,
  logout,
  checkAuth,
  uploadProfileImage,
};
