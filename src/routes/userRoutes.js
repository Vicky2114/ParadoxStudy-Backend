const express = require("express");
const router = express.Router();
const multer = require("multer"); // Middleware for handling multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const UserController = require("../controllers/userController.js");
const authMiddleware = require("../middleware/jwt_authMiddleware.js");
const passport = require("passport");

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 */
router.post("/register", UserController.userRegistration);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post("/login", UserController.userLogin);

/**
 * @swagger
 * /user/accept/{id}:
 *   get:
 *     summary: Verify email
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified
 */
router.get("/accept/:id", UserController.verifyMail);

/**
 * @swagger
 * /user/send-reset-password-email:
 *   post:
 *     summary: Send reset password email
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset password email sent
 */
router.post("/send-reset-password-email", UserController.forgotPassword);

/**
 * @swagger
 * /user/reset-password/{id}/{token}:
 *   post:
 *     summary: Reset user password
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post("/reset-password/:id/:token", UserController.userPasswordReset);

/**
 * @swagger
 * /user/updateProfile:
 *   patch:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch("/updateProfile", authMiddleware, UserController.updateProfile);

/**
 * @swagger
 * /user/userById:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 */
router.get("/userById", authMiddleware, UserController.userById);

/**
 * @swagger
 * /user/deleteBook:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Book deleted
 */
router.delete("/deleteBook", authMiddleware, UserController.deleteBook);

/**
 * @swagger
 * /user/getChats:
 *   post:
 *     summary: Get chats from PDF
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: The PDF file to upload
 *     responses:
 *       200:
 *         description: Chat data
 */
router.post("/getChats", upload.single("pdf"), UserController.getChatMaruti);

/**
 * @swagger
 * /user/getAllData:
 *   post:
 *     summary: Extract all data from PDF
 *     tags: [Data]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: The PDF file to upload
 *     responses:
 *       200:
 *         description: Data extracted successfully
 */
router.post("/getAllData", upload.single("pdf"), UserController.getPdfData);

/**
 * @swagger
 * /user/ask:
 *   post:
 *     summary: Ask a question and get a response from the chatbot using PDF
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: The PDF file to upload
 *     responses:
 *       200:
 *         description: Response from chatbot
 */
router.post("/ask", upload.single("pdf"), UserController.askChatBot);

/**
 * @swagger
 * /user/upload:
 *   post:
 *     summary: Upload a book in PDF format
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: The PDF file to upload
 *     responses:
 *       200:
 *         description: Book uploaded successfully
 */
router.post("/upload", upload.single("pdf"), UserController.uploadBooks);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to your dashboard or success page
    res.redirect('/'); 
  }
);


module.exports = router;
