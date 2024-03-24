const mongoose = require("mongoose");

// Defining the schema for the 'admins' collection
const adminSchema = mongoose.Schema(
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
    // Field indicating if the admin is a super admin, default is false
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    isInstructor: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const adminModel = mongoose.model("admins", adminSchema);

module.exports = adminModel;
