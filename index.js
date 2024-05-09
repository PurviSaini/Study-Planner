const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/User");
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/static", express.static("public"));
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
  res.sendFile("pages/login.html", { root: __dirname });
});

// Home route with session check and basic error handling
app.get("/home", (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/");
  }
  res.sendFile("pages/index.html", { root: __dirname });
});

app.get("/signup", (req, res) => {
  res.sendFile("pages/signup.html", { root: __dirname });
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

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
