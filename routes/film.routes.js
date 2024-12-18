const express = require("express");
const router = express.Router();

const uploadMulter = require("../middlewares/multer.middlewares");
const filmController = require("../controller/film.controller");

// lay tat ca du lieu
router.get("/", filmController.getAll);
router.get("/:id", filmController.getById);

// Them du lieu
const upload = uploadMulter.uploadUlter.fields([
    { name: "poster", maxCount: 1 },
    { name: "backdrop", maxCount: 1 },
]);
router.post("/create", upload, filmController.create);

//Cap nhap
router.put("/update/:id", upload, filmController.update);

// Xoa du lieu
router.delete("/delete/:id", filmController.delete);
/*
|--------------------------------------------------------------------------
| kiem tra file image
|--------------------------------------------------------------------------
*/
router.use((error, req, res, next) => {
    uploadMulter.checkImg(error, req, res, next);
});

module.exports = router;
