const { default: mongoose } = require("mongoose");

// Setting strictQuery option to true to enforce strict query structure.
mongoose.set("strictQuery", true);

// MongoDB connection URL.
var mongoURL = "mongodb+srv://strider:strider123@strider.zfa7jt6.mongodb.net/";

// Connecting to MongoDB database using the provided URI or the fallback URL.
mongoose.connect(process.env.MONGODB_URI || mongoURL, {
  useUnifiedTopology: true,                                // Using unified topology to manage connections.
  useNewUrlParser: true,                                  // Using new URL parser for connection string parsing.
});

// Storing the connection instance in a variable for event handling.
var connection = mongoose.connection;

// Event handler for MongoDB connection error.
connection.on("error", () => {
  console.log("MongDB Connection Failed");                // Logging connection failure.
});

// Event handler for successful MongoDB connection.
connection.on("connected", () => {
  console.log("MongoDB Connection Successful");           // Logging connection success.
});

module.exports = mongoose;

mongoose.set("strictQuery", true);

var mongoURL = "mongodb+srv://strider:strider123@strider.zfa7jt6.mongodb.net/";

mongoose.connect(process.env.MONGODB_URI || mongoURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

var connection = mongoose.connection;

connection.on("error", () => {
  console.log("MongDB Connection Failed");
});

connection.on("connected", () => {
  console.log("MongoDB Connection Successful");
});

module.exports = mongoose;

