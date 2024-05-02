const mongoose = require("mongoose");
const storage = require("../config/cloudnaryConfig");
const multer = require("multer");

const upload = multer({ storage: storage });

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    year: {
      type: String,
    },
    institution: {
      type: String,
    },
    sem: {
      type: String,
    },
    phone: {
      type: String,
    },
    country: {
      type: String,
    },

    state: {
      type: String,
    },
    city: {
      type: String,
    },
    avatar: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
    },
    branch:{
      type:String,
    }
  },
  {
    timestamps: true,
  }
);

userSchema.statics.uploadFiles = upload.fields([
  { name: "avatar", maxCount: 1 },
  // { name: "eventBrochureLink", maxCount: 1 },
]);
// Corrected export statement
const User = mongoose.model("User", userSchema);
module.exports = User;
