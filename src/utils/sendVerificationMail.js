const transporter = require("./createMailTransporter.js");

const sendVerificationMail = (name, email, id) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Email Verification Link",
        html: `<h2>Hello ${name}<a href="http://localhost:${process.env.PORT}/user/verify?id=${id}"> Click Here </a> for email verification </h2>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending verification email:", error);
        } else {
            console.log("Verification email sent");
        }
    });
};

module.exports = { sendVerificationMail };
