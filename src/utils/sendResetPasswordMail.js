const transporter = require("./createMailTransporter.js");
require("dotenv").config();

async function sendResetPasswordMail(name, email, link){
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Password Reset Link",
        html: `
          <html>
            <head>
              <style>
                /* Add your CSS styles here */
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 5px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h2 {
                  color: #333;
                }
                a {
                  color: #007bff;
                  text-decoration: none;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Hello ${name},</h2>
                <p>Welcome to our platform! Please click the following link to reset your Password:</p>
                <p><a href="${link}">Reset Password</a></p>
                <p>Thank you!</p>
              </div>
            </body>
          </html>`,
      };
    
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Reset Password email sent ", info);
      } catch (error) {
        console.error("Error sending reset password email:", error);
        throw new Error("Failed to send reset password email");
      }
}

module.exports = { sendResetPasswordMail };