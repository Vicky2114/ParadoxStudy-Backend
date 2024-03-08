const express = require("express");
const router = express.Router();


router.use('/auth',require('./authRoute'))
router.use('/user',require('./userRoutes'))


module.exports=router