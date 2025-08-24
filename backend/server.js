require("dotenv").config();
const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./lib/error");
const sequelize = require("./lib/db");

const { initSocket } = require("./socket");

// Routes
const mapRoutes = require("./src/routes/mapRoutes");
const rideRoutes = require("./src/routes/rideRoutes");
const authRoutes = require("./src/routes/authRoutes");
const captainRoutes = require("./src/routes/captainRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");

const app = express();
const port = process.env.PORT || 3000;

// CORS config for deployed frontend
app.use(
  cors({
    origin: "https://ryde-j1ba.onrender.com", 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/users", authRoutes);
app.use("/api/v1/captain", captainRoutes);
app.use("/api/v1/maps", mapRoutes);
app.use("/api/v1/ride", rideRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Global error handler
app.use(errorHandler);

// Create server and init Socket.IO
const server = http.createServer(app);
initSocket(server);

// Connect DB and start server
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
