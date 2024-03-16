const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController.js");

router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);
router.get("/accept/:id", UserController.verifyMail);
module.exports = router;
