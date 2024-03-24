// Importing the Mongoose library
const mongoose = require("mongoose");

// Defining the schema for the current project model
const currentProjectSchema = mongoose.Schema(
  {
    // Name of the project
    name: {
      type: String,
      required: true,
    },
    // Due date of the project
    due_date: {
      type: String,
      required: true,
    },
    // Hours required for the project
    hours: {
      type: String,
      required: true,
    },
    // Subject of the project
    subject: {
      type: String,
      required: true,
    },
    // Name of the instructor
    instructor_name: {
      type: String,
      required: true,
    },
    // Email of the instructor
    instructor_email: {
      type: String,
      required: true,
    },
    // GitHub repository link
    github: {
      type: String,
      required: true,
    },
    // Link to project documentation
    document: {
      type: String,
      required: true,
    },
    // Main project ID
    mainProjectId: {
      type: String,
      required: true,
    },
    // Email of the student
    studentemail: {
      type: String,
      required: true,
    },
    // Flag indicating if project setup is complete (default false)
    isSetup: {
      type: Boolean,
      default: false,
    },
    // Commit history of the project (array of objects with date and commit count)
    commitHistory: {
      type: [
        {
          date: String,
          commitCount: Number,
        },
      ],
      default: [],
    },
    // Word count history of the project (array of objects with date/time and word count)
    wordCount: {
      type: [
        {
          dateTime: String,
          wordCount: Number,
        },
      ],
      default: [],
    },
  },
  // Enabling timestamps to automatically track creation and update times
  {
    timestamps: true,
  }
);

// Creating the Current Project model using the defined schema
const currentProjectModel = mongoose.model(
  "currentProjects",
  currentProjectSchema
);

module.exports = currentProjectModel;
