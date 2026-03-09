const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const db = require("./config/db");

// UPDATED CORS — allows your Vercel frontend to call this API
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local dev
      process.env.FRONTEND_URL, // Production frontend
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/saved", require("./routes/savedJobsRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "🚀 JobSphere API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
