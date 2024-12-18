const express = require("express");
const router = express.Router();

const seatController = require("../controller/seat.controller");

router.post("/", seatController.getAll);

module.exports = router;
