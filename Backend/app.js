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