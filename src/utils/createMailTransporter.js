const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: "587",
  secure: false,
  auth: {
    user: "Paradoxstudy5@gmail.com",
    pass: "fmciylyqpbyvflnj",
  },
});

module.exports = transporter;
