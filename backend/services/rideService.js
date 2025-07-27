const Ride = require("../src/model/rideModel");
const mapService = require("./mapService");
const crypto = require("crypto");
const User = require("../src/model/userModel");
const Captain = require("../src/model/captainModel")

// Generate a random OTP
function generateOtp(length = 6) {
  return crypto
    .randomInt(Math.pow(10, length - 1), Math.pow(10, length))
    .toString();
}

// Calculate fare based on coordinates and duration
async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  const pickupCoords = await mapService.getAddressCoordinate(pickup);
  const destinationCoords = await mapService.getAddressCoordinate(destination);

  if (
    !pickupCoords?.lat ||
    !pickupCoords?.lng ||
    !destinationCoords?.lat ||
    !destinationCoords?.lng
  ) {
    throw new Error("Failed to get valid coordinates");
  }

  const origin = `${pickupCoords.lat},${pickupCoords.lng}`;
  const destinationStr = `${destinationCoords.lat},${destinationCoords.lng}`;

  const distanceTime = await mapService.getDistanceTime(origin, destinationStr);

  if (
    !distanceTime ||
    isNaN(Number(distanceTime.distance)) ||
    isNaN(Number(distanceTime.duration))
  ) {
    throw new Error("Failed to fetch distance and duration");
  }

  const baseFare = { auto: 30, car: 50, moto: 20 };
  const perKmRate = { auto: 10, car: 15, moto: 8 };
  const perMinuteRate = { auto: 2, car: 3, moto: 1.5 };

  const distanceKm = Number(distanceTime.distance);
  const durationMin = Number(distanceTime.duration);

  return {
    auto: Math.round(
      baseFare.auto +
        distanceKm * perKmRate.auto +
        durationMin * perMinuteRate.auto
    ),
    car: Math.round(
      baseFare.car +
        distanceKm * perKmRate.car +
        durationMin * perMinuteRate.car
    ),
    moto: Math.round(
      baseFare.moto +
        distanceKm * perKmRate.moto +
        durationMin * perMinuteRate.moto
    ),
  };
}

// Create a new ride
async function createRide({ userId, pickup, destination, vehicleType }) {
  if (!userId || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }

  const fare = await getFare(pickup, destination);
  const otp = generateOtp(6);

  const ride = await Ride.create({
    userId,
    pickup,
    destination,
    fare: fare[vehicleType],
    otp,
    vehicleType,
    status: "pending",
  });

  return ride;
}

// Confirm ride by assigning captain
async function confirmRide({ rideId, captainId }) {
  const ride = await Ride.findByPk(rideId, {
    include: [
      { model: User, as: "user" },
      { model: Captain, as: "captain" }, // Populates real captain data
    ],
  });

  if (!ride) throw new Error("Ride not found");

  if (ride.status !== "pending") {
    throw new Error("Ride not in pending status");
  }

  ride.captainId = captainId;
  ride.status = "accepted";
  await ride.save();

  // Re-fetch with captain included (since updated ride doesn't auto-include new association)
  const updatedRide = await Ride.findByPk(ride.id, {
    include: [
      { model: User, as: "user" },
      { model: Captain, as: "captain" },
    ],
  });

  return updatedRide;
}


// Start ride after OTP validation
async function startRide({ rideId, otp }) {
  const ride = await Ride.findByPk(rideId, {
    include: [
      { model: User, as: "user" },
      { model: Captain, as: "captain" },
    ],
  });

  if (!ride) throw new Error("Ride not found");
  if (ride.status !== "accepted") throw new Error("Ride not accepted yet");
  if (ride.otp !== otp) throw new Error("Invalid OTP");

  // Update status
  ride.status = "ongoing";
  await ride.save();

  // Re-fetch updated ride with associations (if needed)
  const updatedRide = await Ride.findByPk(ride.id, {
    include: [
      { model: User, as: "user" },
      { model: Captain, as: "captain" },
    ],
  });

  return updatedRide;
}


async function endRide({ rideId }) {
  const ride = await Ride.findByPk(rideId, {
    include: [
      {
        model: User,
        as: "user", // 👈 REQUIRED if you used alias in model association
        attributes: ["id", "socketId", "firstname", "lastname"],
      },
      {
        model: Captain,
        as: "captain", // 👈 REQUIRED if you used alias
        attributes: ["id", "socketId", "firstname", "lastname"],
      },
    ],
  });

  if (!ride) throw new Error("Ride not found");

  if (ride.status !== "ongoing")
    throw new Error("Ride is not in an ongoing state");

  ride.status = "completed";
  ride.endTime = new Date();

  if (ride.startTime) {
    const durationMs = new Date() - new Date(ride.startTime);
    ride.totalDurationMinutes = Math.floor(durationMs / 60000);
  }

  await ride.save();
  return ride;
}



module.exports = {
  getFare,
  createRide,
  confirmRide,
  startRide,
  endRide,
};
