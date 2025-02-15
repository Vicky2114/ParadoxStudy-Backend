const transporter = require("./createMailTransporter.js");
require("dotenv").config();
async function sendVerificationMail(name, email, id) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Email Verification Link",
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
            <p>Welcome to our platform! Please click the following link to verify your email:</p>
            <p><a href="http://paradoxstudy.me/pages/register/verified/${id}">Verify Email</a></p>
            <p>If you didn't sign up for our platform, you can safely ignore this email.</p>
            <p>Thank you!</p>
          </div>
        </body>
      </html>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent ", info);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}
async function sendVerifiedAdminEmailToUser(username, email) {
  // Create the email content
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Admin Account Verified",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
      <h1 style="color: #333; text-align: center; font-size: 24px; margin-bottom: 20px;">Hello ${username},</h1>
      
      <p style="font-size: 16px; color: #555; line-height: 1.6;">
        Your admin account has been successfully verified. You now have access to all admin privileges.
      </p>
      
      <div style="text-align: center; margin: 20px 0;">
        <a href="#" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; font-size: 16px; text-decoration: none; border-radius: 5px;">
          Go to Admin Dashboard
        </a>
      </div>
      
      <p style="font-size: 16px; color: #555; line-height: 1.6;">
        If you have any questions, feel free to reach out to our support team.
      </p>
      
      <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
        Best regards,<br> 
        <strong>Team</strong>
      </p>
    </div>
  `,
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
  }
}
async function sendResetPasswordMail(name, email, link) {
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
                <p><a href=${link}>Reset Password</a></p>
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

async function sendEmailToAdminVerified(username, email, userId) {
  // Backend endpoint for admin to verify the user
  const verificationUrl = `https://projectdev2114.azurewebsites.net/api/admin/verify/${userId}`;

  // Create the email content with improved UI
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: "paradoxstudy5@gmail.com",
    subject: "Verify Admin Link",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h1 style="color: #333; text-align: center; font-size: 24px; margin-bottom: 20px;">Admin Verification Request</h1>
        
        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          A new admin account request has been made for <strong>${username}</strong>. Please click the button below to verify the account.
        </p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${verificationUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; font-size: 16px; text-decoration: none; border-radius: 5px;">
            Verify Admin Account
          </a>
        </div>
        
        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
          If you did not request this, please ignore this email.
        </p>
        
        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
          Best regards,<br> 
          <strong>Team</strong>
        </p>
      </div>
    `,
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Verification email sent: ${info.response}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
  }
}
module.exports = {
  sendVerificationMail,
  sendResetPasswordMail,
  sendEmailToAdminVerified,
  sendVerifiedAdminEmailToUser,
};
