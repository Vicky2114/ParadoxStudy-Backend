const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const {
  sendVerificationMail,
  sendResetPasswordMail,
} = require("../utils/sendVerificationMail");

async function getChatMaruti(req, res) {
  try {
    // Make an Axios request here
    const response = await axios.get("http://20.42.96.57:8000");

    // Extract the data from the response
    const responseData = response.data;
    console.log("Response data:", responseData);

    // Send only the data in the response
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in getChatMaruti:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Unable to fetch chat data" });
  }
}

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
      isVerified: isVerified || false,
    });
    await sendVerificationMail(username, email, newUser._id);
    const userData = await newUser.save();

    // Send verification email

    const token = jwt.sign({ userId: userData._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    res.status(201).json({
      status: "success",
      message: "Verification email sent",
      token: token,
    });
  } catch (error) {
    console.error("Error in userRegistration:", error);
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

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ status: "failed", message: "First verify email" });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    res.status(200).json({
      status: "success",
      message: "Login Successfully",
      token: token,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Unable to login" });
  }
}

async function verifyMail(req, res) {
  try {
    const updateInfo = await User.updateOne(
      { _id: req.params.id },
      { $set: { isVerified: true } }
    );

    res.status(201).json({
      status: "success",
      message: "Verification send in email",
      updateInfo: updateInfo,
    });
  } catch (error) {
    console.error(error.message);
  }
}
async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    if (!email) {
      return res
        .status(400)
        .json({ status: "failed", message: "Email field is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "Email not found" });
    }

    const secret = user._id + process.env.jwtSecret;
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "15m" });
    const link = `http://paradoxstudy.me/pages/resetpassword/${user._id}/${token}`;

    await sendResetPasswordMail(user.username, email, link); // Assuming sendResetPasswordMail is defined elsewhere
    res.status(200).json({
      status: "success",
      message: "Password Reset Email Sent... Please Check Your Email",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "failed", message: "Unable to process request" });
  }
}

async function userPasswordReset(req, res) {
  const { password, password_confirmation } = req.body;
  const { id, token } = req.params;
  const user = await User.findById(id);

  const new_secret = user._id + process.env.jwtSecret;

  try {
    jwt.verify(token, new_secret);
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res.status(401).json({
          status: "failed",
          message: "New Password and Confirm New Password doesn't match",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);
        await User.findByIdAndUpdate(user._id, {
          $set: { password: newHashPassword },
        });

        res.send({
          status: "success",
          message: "Password Reset Successfully ",
        });
      }
    } else {
      res
        .status(400)
        .json({ status: "failed", message: "Email field is required" });
    }
  } catch (error) {
    res.status(401).json({
      status: "failed",
      message: "Invalid Token",
    });
  }
}

async function updateProfile(req, res) {
  try {
    await User.uploadFiles(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error uploading files" });
      }

      const userId = req.userId; // Assuming you're using authentication middleware and the user ID is stored in req.user._id

      const { avatar, ...rest } = req.body; // Exclude avatar from the body
      let updatedData = { ...rest };

      let avatarPath;
      if (req.files) {
        // If new avatar is provided, use the new avatar
        avatarPath = req.files["avatar"][0].path; // Corrected to access req.files["avatar"][0].path
      } else if (avatar) {
        // If avatar field is provided in the request body, use it as the new avatar
        avatarPath = avatar;
      }

      let data = {
        ...updatedData,
        avatar: avatarPath ? avatarPath : undefined,
      };

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: data },
        { new: true }
      );

      // const updatedUser = await User.findById(userId); // Fetch updated user data
      res.status(200).json({ status: "success", data: user });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "failed", message: "Unable to process request" });
  }
}

async function userById(req, res) {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "user not present" });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "failed", message: "Unable to process request" });
  }
}

module.exports = {
  userRegistration,
  userLogin,
  verifyMail,
  forgotPassword,
  userPasswordReset,
  updateProfile,
  userById,
  getChatMaruti
};
