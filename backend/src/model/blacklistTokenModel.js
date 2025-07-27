// models/blacklistTokenModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../lib/db");

const BlacklistToken = sequelize.define("BlacklistToken", {
  token: {
    type: DataTypes.STRING(512), // changed from TEXT
    allowNull: false,
    unique: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = BlacklistToken;
