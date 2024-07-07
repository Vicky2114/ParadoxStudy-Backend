const express = require("express");
const router = express.Router();
const multer = require("multer"); // Middleware for handling multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const UserController = require("../controllers/userController.js");
const authMiddleware = require("../middleware/jwt_authMiddleware.js");
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);
router.get("/accept/:id", UserController.verifyMail);
router.post("/send-reset-password-email", UserController.forgotPassword);
// router.post('/send-reset-password/:id/:token', UserController.forgotPassword)
router.post("/reset-password/:id/:token", UserController.userPasswordReset);
router.patch("/updateProfile", authMiddleware, UserController.updateProfile);
router.get("/userById", authMiddleware, UserController.userById);
router.delete("/deleteBook", authMiddleware, UserController.deleteBook);
router.post("/getChats", upload.single("pdf"), UserController.getChatMaruti);
router.post("/getAllData", upload.single("pdf"), UserController.getPdfData);
router.post("/ask", upload.single("pdf"), UserController.askChatBot);
router.post("/upload", upload.single("pdf"), UserController.uploadBooks);

module.exports = router;
