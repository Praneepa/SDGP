const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dbConnection = require('./db');

// GitHub authentication strategy
passport.use(new GitHubStrategy({
  clientID: 'your-github-client-id',
  clientSecret: 'your-github-client-secret',
  callbackURL: 'http://localhost:3000/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user is already registered
    const [rows] = await dbConnection.execute('SELECT * FROM User WHERE username = ?', [profile.username]);
    if (rows.length > 0) {
      return done(null, rows[0]);
    }

    // Create a new user if not registered
    const [result] = await dbConnection.execute('INSERT INTO User (username, password) VALUES (?, ?)', [profile.username, 'generated-password']);
    const newUser = { id: result.insertId, username: profile.username };
    return done(null, newUser);
  } catch (err) {
    return done(err);
  }
}));

// Google authentication strategy
passport.use(new GoogleStrategy({
  clientID: 'your-google-client-id',
  clientSecret: 'your-google-client-secret',
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user is from a valid university email
    const emailDomain = profile.emails[0].value.split('@')[1];
    if (emailDomain !== 'university.edu') {
      return done(null, false, { message: 'Invalid email domain.' });
    }

    // Check if the user is already registered
    const [rows] = await dbConnection.execute('SELECT * FROM User WHERE username = ?', [profile.emails[0].value]);
    if (rows.length > 0) {
      return done(null, rows[0]);
    }

    // Create a new user if not registered
    const [result] = await dbConnection.execute('INSERT INTO User (username, password) VALUES (?, ?)', [profile.emails[0].value, 'generated-password']);
    const newUser = { id: result.insertId, username: profile.emails[0].value };
    return done(null, newUser);
  } catch (err) {
    return done(err);
  }
}));

// Configure Passport serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await dbConnection.execute('SELECT * FROM User WHERE id = ?', [id]);
    if (rows.length > 0) {
      done(null, rows[0]);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err);
  }
});

// GitHub authentication routes
app.get('/auth/github', passport.authenticate('github', { scope: ['repo'] }));
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/protected');
  }
);

// Google authentication routes
app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/protected');
  }
);

// Protected route that requires authentication
app.get('/protected', ensureAuthenticated, (req, res) => {
  res.send(`Hello, ${req.user.username}! You have successfully authenticated.`);
});

// Middleware to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Route for creating a new project
app.post('/projects', ensureAuthenticated, async (req, res) => {
    try {
      const { projectName, adminEmail, releaseDate, deadline, numMilestones } = req.body;
  
      // Check if the admin exists
      const [adminRows] = await dbConnection.execute('SELECT * FROM Admin WHERE Ad_Uni_Email = ?', [adminEmail]);
      if (adminRows.length === 0) {
        return res.status(400).json({ error: 'Invalid admin email' });
      }
  
      // Create the project
      const [result] = await dbConnection.execute('INSERT INTO Project (Ad_Uni_Email, Project_release_date, Project_deadline, Num_Milestones) VALUES (?, ?, ?, ?)', [adminEmail, releaseDate, deadline, numMilestones]);
      const projectId = result.insertId;
  
      // Associate the admin with the project
      await dbConnection.execute('UPDATE Admin SET Project_Id = ? WHERE Ad_Uni_Email = ?', [projectId, adminEmail]);
  
      res.status(201).json({ message: 'Project created successfully', projectId });
    } catch (err) {
      console.error('Error creating project:', err);
      res.status(500).json({ error: 'Failed to create project' });
    }
  });
  
  // Route for adding a student to a project
  app.post('/projects/:projectId/students', ensureAuthenticated, async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const { studentEmail } = req.body;
  
      // Check if the student exists
      const [studentRows] = await dbConnection.execute('SELECT * FROM Student WHERE Sl_Uni_Email = ?', [studentEmail]);
      if (studentRows.length === 0) {
        return res.status(400).json({ error: 'Invalid student email' });
      }
  
      // Associate the student with the project
      await dbConnection.execute('UPDATE Student SET Project_Id = ? WHERE Sl_Uni_Email = ?', [projectId, studentEmail]);
  
      res.status(200).json({ message: 'Student added to the project successfully' });
    } catch (err) {
      console.error('Error adding student to project:', err);
      res.status(500).json({ error: 'Failed to add student to project' });
    }
  });
  
  // Route for getting project details
  app.get('/projects/:projectId', ensureAuthenticated, async (req, res) => {
    try {
      const projectId = req.params.projectId;
  
      // Fetch project details
      const [projectRows] = await dbConnection.execute('SELECT * FROM Project WHERE Project_Id = ?', [projectId]);
      if (projectRows.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      // Fetch associated students
      const [studentRows] = await dbConnection.execute('SELECT Student_Fname, Student_Lname, Sl_Uni_Email FROM Student WHERE Project_Id = ?', [projectId]);
  
      const project = {
        ...projectRows[0],
        students: studentRows
      };
  
      res.status(200).json(project);
    } catch (err) {
      console.error('Error fetching project details:', err);
      res.status(500).json({ error: 'Failed to fetch project details' });
    }
  });



  const fetch = require('node-fetch');

// Route for fetching data from GitHub API
app.get('/github-data/:projectId', ensureAuthenticated, async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Fetch project details and associated students
    const [projectRows] = await dbConnection.execute('SELECT * FROM Project WHERE Project_Id = ?', [projectId]);
    const [studentRows] = await dbConnection.execute('SELECT Sl_Uni_Email FROM Student WHERE Project_Id = ?', [projectId]);

    if (projectRows.length === 0 || studentRows.length === 0) {
      return res.status(404).json({ error: 'Project or students not found' });
    }

    const project = projectRows[0];
    const students = studentRows.map(row => row.Sl_Uni_Email);

    // Fetch data from GitHub API for each student
    const githubData = await Promise.all(students.map(async (studentEmail) => {
      const [userRows] = await dbConnection.execute('SELECT * FROM User WHERE username = ?', [studentEmail]);
      if (userRows.length === 0) {
        return null;
      }

      const user = userRows[0];
      const response = await fetch(`https://api.github.com/repos/${user.username}/issues`, {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`
        }
      });

      const data = await response.json();
      const issueCount = data.length;

      return {
        studentEmail,
        issueCount
      };
    }));

    // Filter out null values (for students without GitHub accounts)
    const filteredData = githubData.filter(data => data !== null);

    // Update the Chart.js data
    updateGitHubIssuesChart(filteredData);

    res.json(filteredData);
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub data' });
  }
});

// Function to update the GitHub Issues Chart.js chart
function updateGitHubIssuesChart(data) {
  // Assuming you have a Chart.js instance created earlier
  const labels = data.map(entry => entry.studentEmail);
  const issuesClosed = data.map(entry => entry.issueCount);

  myGitHubIssuesChart.data.labels = labels;
  myGitHubIssuesChart.data.datasets[0].data = issuesClosed;
  myGitHubIssuesChart.update();
}


const { google } = require('googleapis');

// Route for fetching data from Google Docs API
app.get('/google-docs-data/:projectId', ensureAuthenticated, async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Fetch project details and associated students
    const [projectRows] = await dbConnection.execute('SELECT * FROM Project WHERE Project_Id = ?', [projectId]);
    const [studentRows] = await dbConnection.execute('SELECT Sl_Uni_Email FROM Student WHERE Project_Id = ?', [projectId]);

    if (projectRows.length === 0 || studentRows.length === 0) {
      return res.status(404).json({ error: 'Project or students not found' });
    }

    const project = projectRows[0];
    const students = studentRows.map(row => row.Sl_Uni_Email);

    // Authenticate with Google API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: 'your-service-account-email',
        private_key: 'your-private-key'
      },
      scopes: ['https://www.googleapis.com/auth/documents.readonly']
    });

    //this should be continued
    // Fetch data from Google Docs API for each student