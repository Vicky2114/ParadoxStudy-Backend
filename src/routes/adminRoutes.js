const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin_controller.js");
// const authMiddleware = require("../middleware/jwt_authMiddleware.js");
router.get("/verify/:id", AdminController.verifyAdmin);

module.exports = router;
