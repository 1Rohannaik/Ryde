const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = (user, res) => {
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });

  return token;
};

const generateCaptainTokenAndSetCookie = (captain, res) => {
  const payload = {
    id: captain.id,
    email: captain.email,
    firstname: captain.firstname,
    lastname: captain.lastname,
    fullName: `${captain.firstname || ""} ${captain.lastname || ""}`.trim(),
    vehicleColor: captain.vehicleColor,
    vehiclePlate: captain.vehiclePlate,
    vehicleCapacity: captain.vehicleCapacity,
    vehicleType: captain.vehicleType,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("captainToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite:"None",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });

  return token;
};

module.exports = {
  generateTokenAndSetCookie,
  generateCaptainTokenAndSetCookie,
};
