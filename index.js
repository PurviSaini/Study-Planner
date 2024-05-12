const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/User");
const Task= require("./models/Task");
const Goals= require("./models/Goals");

const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/public", express.static(__dirname + "/public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use environment variable for secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" }, // Set secure flag in production
  })
);
// Connect to MongoDB
const uri = process.env.URI;
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.log("error in connecting to db");
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);

//endpoints for serving the files
app.get("/", (req, res) => {
  req.session.isLoggedIn = false;
  res.sendFile(__dirname +"/pages/login.html");
});

// Home route with session check and basic error handling
app.get("/home", (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/");
  }
  res.sendFile(__dirname+"pages/index.html");
});


app.get("/calendar", (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/");
  }
  res.sendFile(__dirname+"pages/calendar.html");
});

app.get("/signup", (req, res) => {
  res.sendFile(__dirname+"pages/signup.html");
});

// endpoints for APIs
// User signup endpoint
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ title: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.send({ title: "Signup successful" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send({ title: "Failed to create user" });
  }
});
// User login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ title: "Invalid credentials" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ title: "Invalid credentials" });
    }

    // Login successful, set session variable
    req.session.isLoggedIn = true;
    res.send({ title: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ title: "Failed to login" });
  }
});
//get task
app.get("/getTasks", async (req, res) => {
  const userEmail = req.query.email;
  try {
    const tasks = await Task.find({ userEmail });
    res.status(200).send(tasks);
  } catch (error) {
    console.error("Error during getting tasks:", error);
    res.status(500).send({ title: "Failed to get tasks" });
  }
});

//add task
app.post("/addTask", async (req, res) => {
  const { userEmail, taskTitle, taskDesc, startDate, dueDate } = req.body;
  try {
    const task = new Task({ userEmail, taskTitle, taskDesc, startDate, dueDate });
    await task.save();
    res.status(200).send({ title: "Task added successfully", taskId: task._id });
  } catch (error) {
    console.error("Error during adding task:", error);
    res.status(500).send({ title: "Failed to add task" });
  }
});
//add goal
app.post("/addGoal", async (req, res) => {
  const { userEmail, goalTitle, subTasks, startDate, dueDate } = req.body;
  try {
    const goal = new Goals({ userEmail, goalTitle, subTasks, startDate, dueDate });
    await goal.save();
    res.status(200).send({ title: "Goal added successfully", goalId: goal._id });
  } catch (error) {
    console.error("Error during adding goal:", error);
    res.status(500).send({ title: "Failed to add goal" });
  }
});
// Get goals
app.post("/getGoals", async (req, res) => {

  try {
    const  userEmail = req.body.userEmail;
    const startDate = new Date(req.body.clickDate);
    const goal = await Goals.findOne({ userEmail, startDate });
    res.status(200).send(goal);
  } catch (error) {
    console.error("Error during finding goal:", error);
    res.status(500).send({ title: "Failed to find goal" });
  }
});
// Delete task
app.delete("/deleteTask", async (req, res) => {
  const taskId = req.query.taskId;
  try {
    await Task.findByIdAndDelete(taskId);
    res.status(200).send({ title: "Task deleted successfully" });
  } catch (error) {
    console.error("Error during deleting task:", error);
    res.status(500).send({ title: "Failed to delete task" });
  }
});

// Update task status
app.post("/updateStatus", async (req, res) => {
  const { taskId,status } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, { status: status });
    if (!updatedTask) {
      return res.status(404).send({ title: "Task not found" });
    }
    res.status(200).send({ title: "Task status updated successfully" });
  } catch (error) {
    console.error("Error during updating task status:", error);
    res.status(500).send({ title: "Failed to update task status" });
  }
});
// Get goal dates
app.post("/getGoalDates", async (req, res) => {
  const { userEmail } = req.body;
  try {
    const goals = await Goals.find({ userEmail });
    const goalDates = goals.map((goal) => ({
      startDate: goal.startDate,
    }));
    res.status(200).send(goalDates);
  } catch (error) {
    console.error("Error during getting goal dates:", error);
    res.status(500).send({ title: "Failed to get goal dates" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
