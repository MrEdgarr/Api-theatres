const express = require("express");
const router = express.Router();

const citysController = require("../controller/city.controller");

router.get("/", citysController.getAll);

module.exports = router;
