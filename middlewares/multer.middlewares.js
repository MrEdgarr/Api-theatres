const express = require("express");
const router = express.Router();

const multer = require("multer");

// Set up multer
// Chon thu muc luu image
// Dat ten fille
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === "image") {
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    }
};
const uploadMulter = {
    checkImg: (error, req, res, next) => {
        if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    message: "file is too large",
                });
            }
            if (error.code === "LIMIT_FILE_COUNT") {
                return res.status(400).json({
                    message: "File limit reached",
                });
            }

            if (error.code === "LIMIT_UNEXPECTED_FILE") {
                return res.status(400).json({
                    message: "File must be an image",
                });
            }
        }
    },
    uploadUlter: multer({ storage, fileFilter }),
};
module.exports = uploadMulter;
