const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerificationMail } = require("../utils/sendVerificationMail");

async function userRegistration(req, res) {
  const { username, email, password, isVerified } = req.body;
  try {
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(409)
        .json({ status: "failed", message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username: username,
      email: email,
      password: hashPassword,
      isVerified: isVerified
    });
    const userData = await newUser.save();

    const savedUser = await User.findOne({email : email});
    
    sendVerificationMail(req.body.username, req.body.email, userData._id)
    const token = jwt.sign({ userId: savedUser._id }, `process.env.JWT_SECRET`, {
      expiresIn: "10h",
    });

    if(savedUser.isVerified){
      res
      .status(201)
      .json({ status: "success", message: "User registered successfully", token: token });  
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Unable to register" });
  }
}

async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "You are not registered" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "failed", message: "Invalid email or password" });
    }
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, `process.env.JWT_SECRET`, {
        expiresIn: "10h",
      });

      res.status(200).json({
        status: "success",
        message: "Login Successfully",
        token: token,
        user: user,
      });
    }
     
   catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Unable to login" });
  }

}

async function verifyMail(req, res){
  try {
    const updateInfo = await User.updateOne({_id:req.query.id}, { $set: { isVerified: true}});
    
    console.log(updateInfo);
    res.render("views/email-verified")

  } catch (error) {
    console.log(error.message);
  }
}
module.exports = { userRegistration, userLogin, verifyMail };
