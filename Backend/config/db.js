const mysql = require('mysql2/promise');

const dbConnection = mysql.createConnection({
  host: 'your-instance-connection-name', // Replace with your Google Cloud SQL instance connection name
  user: 'your-username',
   // Replace with your username
  password: 'your-password', 
  // Replace with your password
  database: 'your-database-name' // Replace with your database name
});

module.exports = dbConnection;
// This code creates a connection to your Cloud SQL instance and exports it for use in your application. Replace the placeholder values with your own information.