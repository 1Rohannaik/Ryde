require("dotenv").config();
const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./lib/error");
const sequelize = require("./lib/db");
const { initSocket } = require("./socket");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/authRoutes");

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const isProduction = process.env.NODE_ENV === "production";

app.use(
  cors({
    origin: isProduction
      ? "https://ryde-j1ba.onrender.com" 
      : "http://localhost:5173", 
    credentials: true, 
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/users", authRoutes);
app.use("/api/v1/profile", userRoutes);

// Global error handler
app.use(errorHandler);

// Create HTTP server and initialize socket.io
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
