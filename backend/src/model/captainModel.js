const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../../lib/db");

class Captain extends Model {
  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  generateAuthToken() {
    const jwt = require("jsonwebtoken");
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
  }
}

Captain.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Automatically generates UUIDv4
      primaryKey: true,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3],
          msg: "Firstname must be at least 3 characters long",
        },
      },
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [3],
          msg: "Lastname must be at least 3 characters long",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Please enter a valid email" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true, // Optional
      validate: {
        isUrl: {
          msg: "Profile image must be a valid URL",
        },
      },
    },
    socketId: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
    },

    // Vehicle info
    vehicleColor: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3],
          msg: "Color must be at least 3 characters long",
        },
      },
    },
    vehiclePlate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3],
          msg: "Plate must be at least 3 characters long",
        },
      },
    },
    vehicleCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: "Capacity must be at least 1",
        },
      },
    },
    vehicleType: {
      type: DataTypes.ENUM("car", "motorcycle", "auto"),
      allowNull: false,
    },

    // Location (optional)
    ltd: {
      type: DataTypes.DOUBLE,
    },
    lng: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    sequelize,
    modelName: "captain",
    tableName: "captains",
  }
);

module.exports = Captain;
