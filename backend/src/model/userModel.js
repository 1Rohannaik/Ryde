const { DataTypes } = require("sequelize");
const sequelize = require("../../lib/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3],
          msg: "First name must be at least 3 characters long",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [3],
          msg: "Last name must be at least 3 characters long",
        },
      },
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [5],
          msg: "Email must be at least 5 characters long",
        },
        isEmail: {
          msg: "Must be a valid email",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    socketId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING, // Store the image URL (Cloudinary, S3, etc.)
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Profile image must be a valid URL",
        },
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
        user.fullName = `${user.firstName} ${user.lastName || ""}`.trim();
      },
    },
  }
  
);


// User.hasMany(Ride, { foreignKey: "userId", as: "rides" });

// Compare passwords
User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate JWT
User.prototype.generateAuthToken = function () {
  return jwt.sign({ id: this.id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};


module.exports = User;
