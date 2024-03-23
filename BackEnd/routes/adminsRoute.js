// Importing the express library
const express = require("express");
const router = express.Router();

// Importing the Admin model
const Admin = require("../models/admin");

// Route to create a new admin
router.post("/create", async (req, res) => {
  // Destructuring request body
  const {
    name,
    email,
    gender,
    birthday,
    subject,
    level,
    address,
    password,
    isSuperAdmin,
  } = req.body;

  try {
    // Checking if admin with given email already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    // Creating a new admin instance
    const newAdmin = new Admin({
      name,
      email,
      gender,
      birthday,
      subject,
      level,
      address,
      password,
      isSuperAdmin,
    });

    // Saving the new admin to the database
    await newAdmin.save();

    res.send("User Registered Successfully");
  } catch (error) {
    // Handling error if creation fails
    return res
      .status(500)
      .json({ message: "Failed to create admin", error: error.message });
  }
});

// Route for admin login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Finding admin by email
    const admin = await Admin.findOne({ email: email });

    if (admin) {
      // If admin found, check password
      if (admin.password === password) {
        // If password matches, send admin details
        const temp = {
          name: admin.name,
          email: admin.email,
          isSuperAdmin: admin.isSuperAdmin,
          isInstructor: admin.isInstructor,
          _id: admin._id,
        };
        res.send(temp);
      } else {
        // If password incorrect
        return res.status(400).json({ message: "Password incorrect" });
      }
    } else {
      // If admin not found
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    // Handling error
    return res.status(400).json({ error });
  }
});

// Route to get all instructors
router.get("/getInstructors", async (req, res) => {
  try {
    // Finding all instructors
    const instructors = await Admin.find();
    res.json(instructors);
  } catch (error) {
    // Handling error if retrieval fails
    res
      .status(500)
      .json({ message: "Failed to get instructors", error: error.message });
  }
});

// Route to update instructor details
router.post("/update", async (req, res) => {
  // Destructuring request body
  const { _id, name, email, gender, birthday, subject, level, address } = req.body;

  try {
    // Finding and updating instructor by ID
    await Admin.findByIdAndUpdate(_id, {
      name,
      email,
      gender,
      birthday,
      subject,
      level,
      address,
    });
    res.send("Instructor updated successfully");
  } catch (error) {
    // Handling error if update fails
    console.error("Error updating instructor:", error);
    res.status(500).send("Failed to update instructor");
  }
});