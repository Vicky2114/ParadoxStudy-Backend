const express = require("express");
const router = express.Router();

const authController=require('../controllers/auth_controller')
router.get('/',authController.start);

module.exports=router