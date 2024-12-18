const express = require("express");
const router = express.Router();

const userController = require("../controller/auth.controller");

router.get("/", userController.getAll);
router.get("/:id", userController.getById);

router.post("/login", userController.login);
router.post("/register", userController.create);

router.put("/update/:id", userController.update);
router.delete("/delete/:id", userController.delete);
module.exports = router;
