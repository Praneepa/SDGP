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