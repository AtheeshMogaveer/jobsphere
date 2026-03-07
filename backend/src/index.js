const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load .env variables into process.env
dotenv.config();

const app = express();

// MIDDLEWARE
// These run on EVERY request before it hits your routes
app.use(cors()); // Allow React frontend to call this API
app.use(express.json()); // Understand JSON data sent in requests

// TEST ROUTE
// Visit http://localhost:5000 to confirm server works
app.get("/", (req, res) => {
  res.json({ message: "🚀 JobSphere API is running!" });
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
