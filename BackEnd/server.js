const express = require("express");
const helmet = require("helmet");
const cors = require("cors");


const app = express();

const userRoute = require("./routes/usersRoute");
const adminRoute = require("./routes/adminsRoute");
const projectRoute = require("./routes/projectsRoute");
const emailRoute = require("./routes/emailRoute");

app.use(helmet());
app.use(cors());

app.use(
  cors({
    origin: ["https://strider.vercel.app/"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

const dbconfig = require("./db");



app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/admins", adminRoute);
app.use("/api/projects", projectRoute);
app.use("/api/email", emailRoute);

const port = 5000;


app.get("/", (req, res) => {
  res.send("<h1>Server Running SDGP</h1>");
});



app.listen(port, () => console.log("Node Server Started using Nodemon!"));
