const express = require("express");
const router = express.Router();

const bannerController = require("../controller/banner.controller");

// lay tat ca du lieu
router.get("/", bannerController.getAll);

module.exports = router;
