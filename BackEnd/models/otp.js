// Importing the Mongoose library
const mongoose = require("mongoose");

// Defining the schema for the OTP model
const otpSchema = mongoose.Schema({
  // Email of the user for whom OTP is generated
  email: {
    type: String,
    required: true,
  },
  // OTP (One-Time Password) generated for user
  otp: {
    type: String,
    required: true,
  },
  // Expiry time for the OTP
  expiredAt: {
    type: Date,
    // Setting expiry time to 10 minutes from the current time
    expires: 0,
    default: () => new Date(Date.now() + 10 * 60 * 1000),
  },
});

// Creating index on expiredAt field for auto-expiration of documents
otpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

// Creating the OTP model using the defined schema
const otpModel = mongoose.model("otps", otpSchema);

// Exporting the OTP model for use in other files
module.exports = otpModel;
