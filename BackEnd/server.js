const express = require("express");
const path = require("path");

const app = express();

// Serving static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Parsing JSON request bodies
app.use(express.json());

const port = process.env.PORT || 5000;

// Serving static files from the 'client/build' directory in production
if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
}

// Starting the server
app.listen(port, () => console.log("Node Server Started using Nodemon!"));
