const { validationResult } = require("express-validator");
const rideService = require("../../services/rideService");
const mapService = require("../../services/mapService");
const { sendMessageToSocketId } = require("../../socket");

const { User, Ride, Captain } = require("../model/associations");

async function createRide(req, res) {
  // 1. Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // 2. Authenticate user
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user" });
    }

    const { pickup, destination, vehicleType } = req.body;
    const userId = req.user.id;

    // 3. Get coordinates of pickup location
    const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

    // 4. Find nearby captains
    const nearbyCaptains = await mapService.getCaptainsInTheRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      15
    );
    console.log("📍 Nearby captains:", nearbyCaptains);

    // 5. Create the ride in DB
    const ride = await rideService.createRide({
      userId,
      pickup,
      destination,
      vehicleType,
    });

    // 6. Manually add blank OTP for now (can be improved later)
    ride.otp = "";

    // 7. Fetch full ride details with user info via Sequelize association
    const rideWithUser = await Ride.findOne({
      where: { id: ride.id },
      include: [{ model: User, as: "user" }], // ✅ must use `as` if alias was defined in associations
    });

    if (!rideWithUser) {
      return res
        .status(404)
        .json({ success: false, message: "Ride not found after creation" });
    }

    // 8. Send socket message to each nearby captain
    nearbyCaptains.forEach((captain) => {
      if (captain.socketId) {
        console.log(`📡 Sending 'new-ride' to socket: ${captain.socketId}`);
        sendMessageToSocketId(captain.socketId, {
          event: "new-ride",
          data: rideWithUser,
        });
      }
    });

    console.log("✅ Ride created and broadcasted:", rideWithUser.id);

    return res.status(201).json({ success: true, ride: rideWithUser });
  } catch (error) {
    console.error("❌ Error in createRide:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getFare(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { pickup, destination } = req.query;
    const fare = await rideService.getFare(pickup, destination);
    return res.status(200).json({ success: true, fare });
  } catch (error) {
    console.error("Error in getFare:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function confirmRide(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { rideId } = req.body;
    const captainId = req.user.id;

    const ride = await rideService.confirmRide({ rideId, captainId });

    sendMessageToSocketId(ride.user.socketId, {
      event: 'ride-confirmed',
      data:ride
    })

    return res.status(200).json({ success: true, ride });
  } catch (error) {
    console.error("Error in confirmRide:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function startRide(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { rideId, otp } = req.query;
    const ride = await rideService.startRide({ rideId, otp });

    sendMessageToSocketId(ride.user.socketId, {
      event: 'ride-started',
      data:ride,
    })

    return res.status(200).json({ success: true, ride });
  } catch (error) {
    console.error("Error in startRide:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function endRide(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { rideId } = req.body;
    const ride = await rideService.endRide({ rideId });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-ended",
      data: ride,
    });

    return res.status(200).json({ success: true, ride });
  } catch (error) {
    console.error("Error in endRide:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  createRide,
  getFare,
  confirmRide,
  startRide,
  endRide,
};
