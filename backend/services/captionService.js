const captainModel = require("../src/model/captainModel");

module.exports.createcaptain = async ({
  firstname,
  lastname,
  email,
  password,
  color,
  plate,
  capacity,
  vehicleType,
}) => {
  if (
    !firstname ||
    !email ||
    !password ||
    !color ||
    !plate ||
    !capacity ||
    !vehicleType
  ) {
    throw new Error("All fields are required");
  }

  const captain = await captainModel.create({
    firstname,
    lastname,
    email,
    password,
    vehicleColor: color,
    vehiclePlate: plate,
    vehicleCapacity: capacity,
    vehicleType,
  });

  return captain;
};
