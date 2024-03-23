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

// Route for getting project details by project ID
router.get("/getprojectdetails/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Finding current project by ID
    const currentProject = await CurrentProject.findById(projectId);
    if (!currentProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Sending project details as response
    res.status(200).json({ success: true, projectDetails: currentProject });
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({ success: false, message: "Could not fetch project details" });
  }
});

// Route for updating commit history for a project
router.post("/updatecommithistory/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { repoLink } = req.body;

    // Validating GitHub repository link
    if (!repoLink || !repoLink.includes("github.com")) {
      return res.status(400).json({ message: "Invalid GitHub repository link" });
    }

    // Extracting username and repository name from the repository link
    const parts = repoLink.split("/");
    const username = parts[parts.length - 2];
    const repoName = parts[parts.length - 1];

    // Constructing GitHub API URL
    const repoApiUrl = `https://api.github.com/repos/${username}/${repoName}`;

    // Fetching closed issues from the GitHub repository
    const issuesResponse = await axios.get(`${repoApiUrl}/issues?state=closed`);
    const issueDates = issuesResponse.data.map((issue) => moment(issue.closed_at));

    // Handling case where no closed issues are found
    if (issueDates.length === 0) {
      return res.status(404).json({ message: "No closed issues found to determine date range" });
    }

    // Determining date range for commit history based on closed issues
    const minDate = moment.min(...issueDates);
    const maxDate = moment.max(...issueDates);

    // Fetching commits from the GitHub repository within the determined date range
    const commits = [];
    let currentPage = 1;
    let hasNextPage = true;

    // Iterating through pages of commits until no more pages are available
    while (hasNextPage) {
      const commitsUrl = `${repoApiUrl}/commits?since=${minDate.format(
        "YYYY-MM-DD"
      )}&until=${maxDate.add(1, "day").format("YYYY-MM-DD")}&page=${currentPage}`;

      const commitsResponse = await axios.get(commitsUrl, {
        headers: {
          Authorization: `token ${GITHUB_PERSONAL_ACCESS_TOKEN}`,
        },
      });

      // Checking if current page has no commits
      if (commitsResponse.data.length === 0) {
        hasNextPage = false;
      } else {
        commits.push(...commitsResponse.data);
        currentPage++;
      }
    }

    // Counting commits by date
    const commitCountByDate = commits.reduce((acc, commit) => {
      const commitDate = moment(commit.commit.author.date).format("YYYY-MM-DD");
      acc[commitDate] = (acc[commitDate] || 0) + 1;
      return acc;
    }, {});

    // Formatting commit history data
    const formattedData = Object.entries(commitCountByDate).map(
      ([date, commitCount]) => ({ date, commitCount })
    );

    // Finding current project by ID
    const currentProject = await CurrentProject.findById(projectId);
    if (!currentProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Updating commit history for the project
    currentProject.commitHistory = formattedData;
    await currentProject.save();

    // Sending success response with updated commit history
    res.status(200).json({
      success: true,
      message: "Commit history updated successfully",
      commitHistory: currentProject.commitHistory,
    });
  } catch (error) {
    console.error("Error updating commit history:", error);
    res.status(500).json({ success: false, message: "Could not update commit history" });
  }
});

// Route for updating issue history for a project
router.post("/updateissuehistory/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { repoLink } = req.body;

    // Validating GitHub repository link
    if (!repoLink || !repoLink.includes("github.com")) {
      return res.status(400).json({ message: "Invalid GitHub repository link" });
    }

    // Extracting username and repository name from the repository link
    const parts = repoLink.split("/");
    const username = parts[parts.length - 2];
    const repoName = parts[parts.length - 1];

    // Constructing GitHub API URL
    const repoApiUrl = `https://api.github.com/repos/${username}/${repoName}`;

    // Fetching closed issues from the GitHub repository
    const issuesResponse = await axios.get(`${repoApiUrl}/issues?state=closed`);
    const issueDates = issuesResponse.data.map((issue) => moment(issue.closed_at).format("YYYY-MM-DD"));

    // Handling case where no closed issues are found
    if (issueDates.length === 0) {
      return res.status(404).json({ message: "No closed issues found to determine date range" });
    }

    // Counting closed issues by date
    const issueCountByDate = issueDates.reduce((acc, date) => {
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Formatting issue history data
    const formattedData = Object.entries(issueCountByDate).map(
      ([date, commitCount]) => ({ date, commitCount })
    );

    // Finding current project by ID
    const currentProject = await CurrentProject.findById(projectId);
    if (!currentProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Updating issue history for the project
    currentProject.commitHistory = formattedData;
    await currentProject.save();

    // Sending success response with updated issue history
    res.status(200).json({
      success: true,
      message: "Issue history updated successfully",
      commitHistory: currentProject.commitHistory,
    });
  } catch (error) {
    console.error("Error updating issue history:", error);
    res.status(500).json({ success: false, message: "Could not update issue history" });
  }
});

// Function to fetch document content from Google Docs
async function fetchDocContent(docUrl) {
  const docId = docUrl.match(/\/document\/d\/([^/]+)\//)[1];
  const url = `https://docs.google.com/document/d/${docId}/export?format=txt`;
  const response = await axios.get(url);
  const content = response.data;

  return content;
}

// Route for fetching information (date and word count) of a Google Doc by Doc ID
router.post("/docinfo", async (req, res) => {
  try {
    const { docId } = req.body;
    // Checking if Doc ID is provided
    if (!docId) {
      return res.status(400).json({ message: "Google Doc ID is required" });
    }

    // Fetching content of the Google Doc
    const content = await fetchDocContent(docId);
    // Getting current date and time
    const currentDateTime = moment().format("YYYY-MM-DD h:mm a");
    // Counting words in the document content
    const wordCountResult = wordCount(content);

    // Sending response with document information
    res.json({
      dateTime: currentDateTime,
      wordCount: wordCountResult,
    });
  } catch (error) {
    console.error("Error fetching google doc content:", error);
    res.status(500).json({ message: "Error fetching google doc content" });
  }
});

// Route for fetching information (date and word count) of a Google Doc by Doc ID and updating project details
router.post("/docinfo/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { docId } = req.body;

    // Checking if Doc ID is provided
    if (!docId) {
      return res.status(400).json({ message: "Google Doc ID is required" });
    }

    // Fetching content of the Google Doc
    const content = await fetchDocContent(docId);
    // Getting current date and time
    const currentDateTime = moment().format("YYYY-MM-DD h:mm a");
    // Counting words in the document content
    const wordCountResult = wordCount(content);

    // Updating project details with word count information
    await CurrentProject.findOneAndUpdate(
      { _id: projectId },
      {
        $push: {
          wordCount: {
            dateTime: currentDateTime,
            wordCount: wordCountResult,
          },
        },
      },
      { new: true }
    );

    // Sending response with document information
    res.json({
      dateTime: currentDateTime,
      wordCount: wordCountResult,
    });
  } catch (error) {
    console.error("Error fetching google doc content:", error);
    res.status(500).json({ message: "Error fetching google doc content" });
  }
});

// Route for deleting a main project along with its related current projects
router.post("/deletemain", async (req, res) => {
  try {
    const { id } = req.body;

    // Deleting related current projects
    await CurrentProject.deleteMany({ mainProjectId: id });

    // Deleting the main project
    const deletedProject = await Project.findByIdAndDelete(id);

    // Checking if the main project exists
    if (!deletedProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Sending success response after deleting the project
    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ success: false, message: "Could not delete project" });
  }
});

module.exports = router;
