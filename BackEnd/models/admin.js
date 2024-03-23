const mongoose = require("mongoose");

// Defining the schema for the 'admins' collection
const adminSchema = mongoose.Schema(
  {
    // Field for admin name, not required
    name: {
      type: String,
      required: false,
    },

    // Field for admin email, required
    email: {
      type: String,
      required: true,
    },

    // Field for admin gender, not required
    gender: {
      type: String,
      required: false,
    },

    // Field for admin birthday, not required
    birthday: {
      type: String,
      required: false,
    },

    // Field for admin subject, not required
    subject: {
      type: String,
      required: false,
    },

    // Field for admin level, not required
    level: {
      type: String,
      required: false,
    },

    // Field for admin address, not required
    address: {
      type: String,
      required: false,
    },

    // Field for admin password, required
    password: {
      type: String,
      required: true,
    },

    // Field indicating if the admin is a super admin, default is false
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },

    // Field indicating if the admin is an instructor, default is true
    isInstructor: {
      type: Boolean,
      default: true,
    },
  },
  // Options for the schema
  {
    // Automatically add createdAt and updatedAt timestamps to documents
    timestamps: true,
  }
);

// Creating a Mongoose model based on the schema for the 'admins' collection
const adminModel = mongoose.model("admins", adminSchema);

module.exports = adminModel;
