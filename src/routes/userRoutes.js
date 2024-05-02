const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController.js");
const authMiddleware=require('../middleware/jwt_authMiddleware.js')
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);
router.get("/accept/:id", UserController.verifyMail);
router.post('/send-reset-password-email', UserController.forgotPassword)
// router.post('/send-reset-password/:id/:token', UserController.forgotPassword)
router.post('/reset-password/:id/:token', UserController.userPasswordReset)
router.patch('/updateProfile',authMiddleware ,UserController.updateProfile)
router.get('/userById',authMiddleware ,UserController.userById)

module.exports = router;
