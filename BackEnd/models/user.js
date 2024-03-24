const mongoose = require("mongoose");

// Defining the schema for the user model
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },

    email: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: false,
    },
    birthday: {
      type: String,
      required: false,
    },
    subject: {
      type: String,
      required: false,
    },
    level: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },

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

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;