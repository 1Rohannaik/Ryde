require("dotenv").config();
const express = require("express");
const http = require("http"); // 👉 Add this
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const errorHandler = require("./lib/error");
const sequelize = require("./lib/db");


// 👉 Import your socket initializer
const { initSocket } = require("./socket");

const mapRoutes = require("./src/routes/mapRoutes");
const rideRouts = require("./src/routes/rideRoutes");
const authRoutes = require("./src/routes/authRoutes");
const captainRoutes = require("./src/routes/captainRoutes");

// cors config
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/users", authRoutes);
app.use("/api/v1/captain", captainRoutes);
app.use("/api/v1/maps", mapRoutes);
app.use("/api/v1/ride", rideRouts);

// Global error handler
app.use(errorHandler);

// ✅ Create server instance
const server = http.createServer(app);

// ✅ Initialize Socket.IO with this server
initSocket(server);

// Connect to DB and start HTTP + WebSocket server
sequelize
  .sync()
  .then(() => {
    console.log("DB connected successfully");
    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });
