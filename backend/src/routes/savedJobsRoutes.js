const express = require("express");
const router = express.Router();
const {
  saveJob,
  getSavedJobs,
  deleteSavedJob,
  checkIfSaved,
} = require("../controllers/savedJobsController");
const authMiddleware = require("../middleware/authMiddleware");

// All saved jobs routes are private
// authMiddleware runs on ALL routes below
router.use(authMiddleware);

router.post("/", saveJob);
router.get("/", getSavedJobs);
router.delete("/:jobId", deleteSavedJob);
router.get("/check/:jobId", checkIfSaved);

module.exports = router;
