const express = require("express");
const router = express.Router();
const Project = require("../models/project"); // Importing the Project model
const CurrentProject = require("../models/currentproject"); // Importing the CurrentProject model
const axios = require("axios"); // Importing Axios for making HTTP requests
const moment = require("moment"); // Importing Moment.js for date/time manipulation
const wordCount = require("word-count"); // Importing word-count for calculating word count

// GitHub personal access token for accessing GitHub API
const GITHUB_PERSONAL_ACCESS_TOKEN = "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";

// Route for creating a new project
router.post("/createproject", async (req, res) => {
  try {
    const { name, due_date, hours, subject, github, document, students } = req.body;

    // Creating a new Project instance
    const newProject = new Project({
      name,
      due_date,
      hours,
      subject,
      github,
      document,
      students,
    });

    // Saving the new project to the database
    const savedProject = await newProject.save();

    res.send("Project Created Successfully");
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ success: false, message: "Could not create project" });
  }
});

// Route for fetching all projects
router.get("/getallprojects", async (req, res) => {
  try {
    // Finding all projects in the database
    const projects = await Project.find();

    res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, message: "Could not fetch projects" });
  }
});

// Route for creating a new project via modal
router.post("/createprojectmodal", async (req, res) => {
  try {
    const {
      name,
      due_date,
      hours,
      subject,
      students,
      instructor_email,
      instructor_name,
    } = req.body;

    // Extracting student emails from the students array
    const studentEmails = students.map((student) => student.email);

    // Creating a new Project instance
    const newProject = new Project({
      name,
      due_date,
      hours,
      subject,
      students: studentEmails,
      instructor_email,
      instructor_name,
    });

    // Saving the new project to the database
    const savedProject = await newProject.save();

    // Create current project for each student
    for (const studentEmail of studentEmails) {
      const currentProjectData = {
        name: savedProject.name,
        due_date: savedProject.due_date,
        hours: savedProject.hours,
        subject: savedProject.subject,
        instructor_name: savedProject.instructor_name,
        instructor_email: savedProject.instructor_email,
        github: "N/A",
        document: "N/A",
        mainProjectId: savedProject._id,
        studentemail: studentEmail,
      };

      const newCurrentProject = new CurrentProject(currentProjectData);
      await newCurrentProject.save();
    }

    res.send("Project Created Successfully");
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route for fetching current projects by main project ID
router.get("/getCurrentProjectByMain/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Finding current projects by main project ID
    const currentProjects = await CurrentProject.find({
      mainProjectId: projectId,
    });

    res.status(200).json({ success: true, currentProjects });
  } catch (error) {
    console.error("Error fetching current projects by main project:", error);
    res.status(500).json({ success: false, message: "Could not fetch current projects" });
  }
});

// Route for getting current projects by project ID
router.get("/getCurrentProjectByProjectId/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Finding current projects by project ID
    const currentProjects = await CurrentProject.findById(projectId);

    // Sending the current projects as response
    res.json(currentProjects);
  } catch (error) {
    console.error("Error fetching current projects by project ID:", error);
    res.status(500).json({ success: false, message: "Could not fetch current projects" });
  }
});

// Route for updating project details
router.post("/updateprojectdetails", async (req, res) => {
  try {
    const { projectId, github, document } = req.body;

    // Finding current project by ID
    const currentProject = await CurrentProject.findById(projectId);
    if (!currentProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Updating project details
    currentProject.github = github || currentProject.github;
    currentProject.document = document || currentProject.document;
    currentProject.wordCount = [];
    currentProject.commitHistory = [];

    // Saving the updated project
    await currentProject.save();

    // Sending success message as response
    res.status(200).json({ success: true, message: "Project details updated successfully" });
  } catch (error) {
    console.error("Error updating project details:", error);
    res.status(500).json({ success: false, message: "Could not update project details" });
  }
});

// Route for getting current projects by user ID
router.get("/getcurrentprojectsbyid", async (req, res) => {
  try {
    const userEmail = req.query.userEmail;

    // Finding current projects by user email
    const currentProjects = await CurrentProject.find({ studentemail: userEmail });

    // Sending the current projects as response
    res.status(200).json({ success: true, currentProjects });
  } catch (error) {
    console.error("Error fetching current projects by user ID:", error);
    res.status(500).json({ success: false, message: "Could not fetch current projects" });
  }
});

// Route for setting up a project
router.post("/setupproject", async (req, res) => {
  try {
    const { projectId, github, document } = req.body;

    // Finding current project by ID
    const currentProject = await CurrentProject.findById(projectId);
    if (!currentProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Updating project details and marking as setup
    currentProject.github = github || currentProject.github;
    currentProject.document = document || currentProject.document;
    currentProject.isSetup = true;

    // Saving the updated project
    await currentProject.save();

    // Sending success message as response
    res.status(200).json({ success: true, message: "Project setup completed successfully" });
  } catch (error) {
    console.error("Error setting up project:", error);
    res.status(500).json({ success: false, message: "Could not setup project" });
  }
});
