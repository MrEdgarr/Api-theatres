const express = require("express");
const router = express.Router();

const schedulesController = require("../controller/schedule.controller");

router.post("/getMovieShowtimes", schedulesController.getMovieShowtimes);
router.post(
    "/getTheaterSystemInformation",
    schedulesController.getTheaterSystemInformation
);
router.post(
    "/getMovieShowtimeInformation",
    schedulesController.getMovieShowtimeInformation
);

module.exports = router;
