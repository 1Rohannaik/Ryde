const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {CaptainProtected} = require("../middleware/authMiddleware");
const {
  captainSignup,
  captainLogin,
  captainLogout,
  captainProfile,
  captainCheckAuth,
  uploadCaptainProfileImage,
} = require("../controllers/captainController");
const upload = require("../middleware/upload")

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("vehicleColor")
      .isLength({ min: 3 })
      .withMessage("Color must be at least 3 characters long"),
    body("vehiclePlate")
      .isLength({ min: 3 })
      .withMessage("Plate must be at least 3 characters long"),
    body("vehicleCapacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be at least 1"),
    body("vehicleType")
      .isIn(["car", "motorcycle", "auto"])
      .withMessage("Invalid vehicle type"),
  ],
  captainSignup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  captainLogin
);

router.post(
  "/upload-profile-image",
  CaptainProtected,
  upload.single("profileImage"),
  uploadCaptainProfileImage
);
router.get("/profile", CaptainProtected, captainProfile);
router.post("/logout", CaptainProtected, captainLogout);
router.get("/check", CaptainProtected, captainCheckAuth);

module.exports = router;
