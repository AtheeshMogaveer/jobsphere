const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// This line connects to DB the moment server starts
const db = require("./config/db");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "🚀 JobSphere API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
