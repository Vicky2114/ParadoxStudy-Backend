const User = require("../models/user.model");
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

module.exports = {
  verifyAdmin,
};
