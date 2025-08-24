const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const BlacklistToken = require("../model/blacklistTokenModel");

const protected = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // 🔎 Check blacklist
    const isBlacklisted = await BlacklistToken.findOne({ where: { token } });
    if (isBlacklisted) {
      return res.status(401).json({ message: "Token has been blacklisted" });
    }

    // 🔑 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔎 Find user in DB
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("User auth error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.status(401).json({ message: "Not authorized" });
  }
};

const CaptainProtected = async (req, res, next) => {
  try {
    console.log("Incoming captain cookies:", req.cookies);

    const token = req.cookies?.captainToken;
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // 🔎 Check blacklist
    const blacklisted = await BlacklistToken.findOne({ where: { token } });
    if (blacklisted) {
      return res.status(401).json({ message: "Token is blacklisted" });
    }

    // 🔑 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const fullName =
      decoded.fullName ||
      `${decoded.firstname || ""} ${decoded.lastname || ""}`.trim();

    // ✅ Attach captain info to req
    req.user = {
      id: decoded.id,
      firstname: decoded.firstname,
      lastname: decoded.lastname,
      fullName,
      email: decoded.email,
      vehicleColor: decoded.vehicleColor,
      vehiclePlate: decoded.vehiclePlate,
      vehicleCapacity: decoded.vehicleCapacity,
      vehicleType: decoded.vehicleType,
    };

    next();
  } catch (error) {
    console.error("Captain auth middleware error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Captain token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid captain token" });
    }

    res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = { CaptainProtected, protected };
