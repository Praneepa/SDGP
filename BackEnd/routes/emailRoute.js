const express = require("express");
const router = express.Router();
const User = require("../models/user");                       // Importing the User model
const EmailService = require("../services/EmailService");    // Importing the EmailService module
const Otp = require("../models/otp");                       // Importing the OTP model

// Function to generate a random six-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to generate the HTML content for the password reset email
function getPasswordResetEmailContent(otp) {
  return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
            }
            .header {
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
            }
            .content {
              padding: 20px;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Password Reset OTP</h2>
            </div>
            <div class="content">
              <p>Your OTP for password reset is: <strong>${otp}</strong></p>
              <p>This OTP will expire in 10 minutes.</p>
            </div>
            <div class="footer">
              <p>If you didn't request this password reset, you can safely ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
}

// Route for generating and sending OTP
router.post("/otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Checking if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Checking if there is an active OTP already exists
    const existingOTP = await Otp.findOne({ email });
    if (existingOTP && existingOTP.expiredAt > new Date()) {
      return res
        .status(400)
        .json({ error: "An active OTP already exists for this user" });
    }

    // Generating a new OTP
    const otp = generateOTP();

    // Creating a new OTP document and saving it
    const otpDocument = new Otp({
      email,
      otp,
      expiredAt: new Date(Date.now() + 10 * 60 * 1000), // OTP expiration time set to 10 minutes from now
    });
    await otpDocument.save();

    // Generating the email content
    const emailContent = getPasswordResetEmailContent(otp);
    
    // Sending the OTP email
    await EmailService.sendOTP(user, emailContent);

    // Sending success response
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error generating and sending OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route for verifying OTP
router.post("/otpcheck", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Finding the OTP document
    const otpDocument = await Otp.findOne({ email, otp });

    // Checking if OTP is valid
    if (!otpDocument) {
      return res.status(400).json({ error: "Invalid OTP or email" });
    }

    // Checking if OTP has expired
    if (otpDocument.expiredAt < new Date()) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    // Sending success response
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router; // Exporting the router for use in other files
