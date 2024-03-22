// Importing Mongoose library for MongoDB interactions
const mongoose = require("mongoose");

// Defining the schema for the user model
const userSchema = mongoose.Schema(
  {
    // Name of the user (optional)
    name: {
      type: String,
      required: false,
    },

    // Email of the user (mandatory)
    email: {
      type: String,
      required: true,
    },

    // Gender of the user (optional)
    gender: {
      type: String,
      required: false,
    },

    // Birthday of the user (optional)
    birthday: {
      type: String,
      required: false,
    },

    // Subject the user is interested in (optional)
    subject: {
      type: String,
      required: false,
    },

    // Level of the user (optional)
    level: {
      type: String,
      required: false,
    },

    // Address of the user (optional)
    address: {
      type: String,
      required: false,
    },

    // Password of the user (mandatory)
    password: {
      type: String,
      required: true,
    },
  },
  {
    // Including timestamps for createdAt and updatedAt
    timestamps: true,
  }
);

// Creating the user model based on the schema
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;