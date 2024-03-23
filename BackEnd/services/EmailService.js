const nodemailer = require("nodemailer");

// Creating a nodemailer transporter with Gmail service
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    type: "login",
    user: "nodeapp53@gmail.com",
    pass: "yxhv kxwc etcw mchy", 
  },
});

// EmailService class responsible for sending OTP emails
class EmailService {
  // Static method to send OTP to a user's email
  static async sendOTP(user, emailContent) {
    try {
      // Constructing mail options
      const mailOptions = {
        from: '"Strider" <nodeapp53@gmail.com>',                  // Sender's email address
        to: user.email,                                           // Receiver's email address
        subject: "Password Reset OTP Code",                       // Email subject
        html: emailContent,                                       // Email content in HTML format
      };

      // Sending email and awaiting the response
      const info = await transporter.sendMail(mailOptions);
      console.log(`OTP code sent to ${user.email}: ${info.response}`); 
    } catch (error) {
      console.error("Error sending OTP code:", error); 
    }
  }
}

module.exports = EmailService; 
