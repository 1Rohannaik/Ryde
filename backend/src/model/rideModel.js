// models/ride.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../lib/db"); // Your Sequelize instance

const Ride = sequelize.define(
  "Ride",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Auto-generate UUID v4
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false, // User must be provided
      references: {
        model: "users", // table name of User model (must be lowercase plural if default)
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    captainId: {
      type: DataTypes.UUID,
      allowNull: true, // Initially null; assigned when captain accepts ride
      references: {
        model: "users", // Assuming captains are also users in 'users' table
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },

    pickup: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    otp: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },

    vehicleType: {
      type: DataTypes.ENUM("auto", "car", "moto"),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "accepted",
        "ongoing",
        "completed",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "rides",
    timestamps: true, // createdAt and updatedAt
  }
);

module.exports = Ride;
