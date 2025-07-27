const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../lib/cloudinary"); // your config file

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profileImages",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage });

module.exports = upload;
