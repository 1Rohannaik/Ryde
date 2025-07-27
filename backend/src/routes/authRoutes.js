const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  signup,
  login,
  getUserProfile,
  logout,
  checkAuth,
  uploadProfileImage,
} = require("../controllers/authController");
const { protected } = require("../middleware/authMiddleware");
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
  ],
  signup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  login
);

router.post(
  "/upload-profile-image",
  protected,
  upload.single("profileImage"), 
  uploadProfileImage
);
router.get("/profile", protected, getUserProfile);

router.post("/logout", logout);
router.get("/check", protected, checkAuth);

module.exports = router;
