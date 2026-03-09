const express = require("express");
const router = express.Router();
const {
  searchJobs,
  searchByCompany,
  getJobDetails,
  getSearchHistory,
} = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuth");

// Public routes (history saved if logged in)
router.get("/search", optionalAuth, searchJobs);
router.get("/company/:name", optionalAuth, searchByCompany);
router.get("/detail/:id", getJobDetails);

// Private routes
router.get("/history", authMiddleware, getSearchHistory);

module.exports = router;
