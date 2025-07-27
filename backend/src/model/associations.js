const User = require("./userModel");
const Ride = require("./rideModel");
const Captain = require("./captainModel");

// 👇 Associations
User.hasMany(Ride, { foreignKey: "userId", as: "rides" });
Ride.belongsTo(User, { foreignKey: "userId", as: "user" });

Captain.hasMany(Ride, { foreignKey: "captainId", as: "rides" });
Ride.belongsTo(Captain, { foreignKey: "captainId", as: "captain" });

module.exports = {
  User,
  Ride,
  Captain,
};
