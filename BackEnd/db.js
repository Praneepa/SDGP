const { default: mongoose } = require("mongoose");
// Setting strictQuery option to true to enforce strict query structure.
mongoose.set("strictQuery", true);

// MongoDB connection URL.
var mongoURL = "mongodb+srv://strider:strider123@strider.zfa7jt6.mongodb.net/";

// Connecting to MongoDB database using the provided URI or the fallback URL.
mongoose.connect( mongoURL, {
  useUnifiedTopology: true,                                
  useNewUrlParser: true,                                  
});

// Storing the connection instance in a variable for event handling.
var connection = mongoose.connection;

// Event handler for MongoDB connection error.
connection.on("error", () => {
  console.log("MongDB Connection Failed");                
});

// Event handler for successful MongoDB connection.
connection.on("connected", () => {
  console.log("MongoDB Connection Successful");          
});

module.exports = mongoose;