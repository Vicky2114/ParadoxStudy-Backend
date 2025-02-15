const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  sendVerifiedAdminEmailToUser,
} = require("../utils/sendVerificationMail");

async function verifyAdmin(req, res) {
  const { id } = req.params;
  console.log(id);
  try {
    if (!id) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required" });
    }

    const existingUser = await User.findOne({ _id: id });
    existingUser.isAdmin = true;
    existingUser.save();

    await sendVerifiedAdminEmailToUser(
      existingUser.username,
      existingUser.email
    );
    res.status(201).json({
      status: "success",
      message: "Admin Account Verified Succesfully",
    });
  } catch (error) {
    console.error("Error in Admin Account Verified:", error);
    res.status(500).json({
      status: "failed",
      message: "Unable to Admin Account Verified",
      error: error,
    });
  }
}

async function adminLogin(req, res) {
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

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ status: "failed", message: "First verify email" });
    }
    if (!user.isAdmin) {
      return res
        .status(401)
        .json({
          status: "failed",
          message: "not verified as a admin please check",
        });
    }

    // Generate JWT token without expiration time
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      status: "success",
      message: "Login Successfully as Admin",
      token: token,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Unable to login" });
  }
}

module.exports = {
  verifyAdmin,
  adminLogin
};
