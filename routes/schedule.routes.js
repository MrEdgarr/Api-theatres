const express = require("express");
const router = express.Router();

const schedulesController = require("../controller/schedule.controller");

router.post("/getMovieShowtimes", schedulesController.getMovieShowtimes);
router.post(
    "/getMovieShowtimeInformation",
    schedulesController.getMovieShowtimeInformation
);
router.post(
    "/getShowtimeInformation",
    schedulesController.getShowtimeInformation
);

module.exports = router;
