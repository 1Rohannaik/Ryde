const socketIo = require("socket.io");
const User = require("./src/model/userModel");
const Captain = require("./src/model/captainModel");
const Ride = require("./src/model/rideModel");

let io;

function initSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: [
        "https://ryde-j1ba.onrender.com",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async (data) => {
      const { userId, userType } = data;
      console.log(
        `Join event received: userId=${userId}, userType=${userType}`
      );
      try {
        if (userType === "user") {
          await User.update({ socketId: socket.id }, { where: { id: userId } });
          console.log(`User ${userId} socket updated: ${socket.id}`);
        } else if (userType === "captain") {
          await Captain.update(
            { socketId: socket.id },
            { where: { id: userId } }
          );
          console.log(`Captain ${userId} socket updated: ${socket.id}`);
        }
        console.log(`${userType} ${userId} connected with socket ${socket.id}`);
      } catch (error) {
        console.error(`Error updating ${userType} socket ID:`, error);
      }
    });

    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;

      // Validate location data
      if (
        !userId ||
        !location ||
        typeof location.latitude !== "number" ||
        typeof location.longitude !== "number"
      ) {
        return socket.emit("error", {
          message: "Invalid location data or userId",
        });
      }

      try {
        // Update captain's coordinates in DB
        await Captain.update(
          {
            ltd: location.latitude,
            lng: location.longitude,
            updatedAt: new Date(),
          },
          {
            where: { id: userId },
          }
        );

        console.log(`✅ Captain ${userId} location updated`);
      } catch (error) {
        console.error("❌ Error updating captain location:", error);
        socket.emit("error", { message: "Failed to update location" });
      }
    });

    socket.on("confirm-dropoff", async (data) => {
      const { rideId } = data;
      try {
        const ride = await Ride.findByPk(rideId);
        if (!ride) {
          return socket.emit("error", { message: "Ride not found" });
        }
        const captain = await Captain.findByPk(ride.captainId);
        if (!captain) {
          return socket.emit("error", { message: "Captain not found" });
        }
        sendMessageToSocketId(captain.socketId, {
          event: "ride-confirmed",
          data: ride,
        });
        console.log(
          `Drop-off confirmation sent to captain ${ride.captainId} for ride ${rideId}`
        );
      } catch (error) {
        console.error("Error handling confirm-dropoff:", error);
        socket.emit("error", { message: "Failed to process drop-off" });
      }
    });

    socket.on("disconnect", async () => {
      console.log(`Client disconnected: ${socket.id}`);
      try {
        await Promise.all([
          User.update({ socketId: null }, { where: { socketId: socket.id } }),
          Captain.update(
            { socketId: null },
            { where: { socketId: socket.id } }
          ),
        ]);
      } catch (error) {
        console.error("Error cleaning up socket IDs:", error);
      }
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  if (!socketId) {
    console.log("No socket ID provided for event:", messageObject.event);
    return;
  }

  if (io) {
    console.log(`Sending ${messageObject.event} to socket ${socketId}`);
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

module.exports = {
  initSocket,
  sendMessageToSocketId,
};
