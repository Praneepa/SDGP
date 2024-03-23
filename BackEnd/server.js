// Importing required modules
const express = require("express"); // Express framework for Node.js
const path = require("path"); // Module for working with file and directory paths

// Creating an Express application
const app = express();

// Importing route modules
const userRoute = require("./routes/usersRoute"); // Users routes
const adminRoute = require("./routes/adminsRoute"); // Admins routes
const projectRoute = require("./routes/projectsRoute"); // Projects routes
const emailRoute = require("./routes/emailRoute"); // Email routes

// Importing database configuration
const dbconfig = require("./db"); // Database configuration

// Serving static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Parsing incoming request bodies in JSON format
app.use(express.json());

// Mounting route handlers
app.use("/api/users", userRoute); // Mounting users routes
app.use("/api/admins", adminRoute); // Mounting admins routes
app.use("/api/projects", projectRoute); // Mounting projects routes
app.use("/api/email", emailRoute); // Mounting email routes

// Setting up the port for the server to listen on
const port = process.env.PORT || 5000; // Default port is 5000, can be overridden by environment variable

// Serving static files in production mode
if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
}

// Starting the server and listening on the specified port
app.listen(port, () => console.log("Node Server Started using Nodemon!"));
