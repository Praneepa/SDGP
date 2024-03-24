const mongoose = require("mongoose");

// Defining the schema for the project model
const projectSchema = mongoose.Schema(
  {
    // Name of the project
    name: {
      type: String,
      required: false, // Not mandatory
    },
    // Due date of the project
    due_date: {
      type: String,
      required: false, // Not mandatory
    },
    // Hours required for the project
    hours: {
      type: String,
      required: false, // Not mandatory
    },
    // Subject of the project
    subject: {
      type: String,
      required: false, // Not mandatory
    },
    // Name of the instructor
    instructor_name: {
      type: String,
      required: false, // Not mandatory
    },
    // Email of the instructor
    instructor_email: {
      type: String,
      required: false, // Not mandatory
    },
    // List of students involved in the project (empty array to start with)
    students: [],
  },
  // Enabling timestamps to automatically track creation and update times
  {
    timestamps: true,
  }
);

// Creating the Project model using the defined schema
const projectModel = mongoose.model("projects", projectSchema);

module.exports = projectModel;
