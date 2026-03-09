const db = require("../config/db");

// ================================
// SAVE A JOB
// POST /api/saved
// ================================
const saveJob = async (req, res) => {
  try {
    const { job_id, job_title, company, location, job_url, salary } = req.body;

    // 1. Validate required fields
    if (!job_id || !job_title || !company) {
      return res.status(400).json({
        error: "job_id, job_title and company are required",
      });
    }

    // 2. Check if already saved (prevent duplicates)
    const existing = await db.query(
      "SELECT id FROM saved_jobs WHERE user_id = $1 AND job_id = $2",
      [req.userId, job_id],
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        error: "Job already saved",
      });
    }

    // 3. Save the job
    const result = await db.query(
      `INSERT INTO saved_jobs 
        (user_id, job_id, job_title, company, location, job_url, salary)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.userId, job_id, job_title, company, location, job_url, salary],
    );

    res.status(201).json({
      message: "Job saved successfully!",
      saved_job: result.rows[0],
    });
  } catch (error) {
    console.error("Save job error:", error.message);
    res.status(500).json({ error: "Failed to save job" });
  }
};

// ================================
// GET ALL SAVED JOBS
// GET /api/saved
// ================================
const getSavedJobs = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM saved_jobs 
       WHERE user_id = $1 
       ORDER BY saved_at DESC`,
      [req.userId],
    );

    res.json({
      status: "success",
      total: result.rows.length,
      saved_jobs: result.rows,
    });
  } catch (error) {
    console.error("Get saved jobs error:", error.message);
    res.status(500).json({ error: "Failed to fetch saved jobs" });
  }
};

// ================================
// DELETE A SAVED JOB
// DELETE /api/saved/:jobId
// ================================
const deleteSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Make sure the job belongs to THIS user
    // Never just delete by job_id alone — another user could delete your saved job!
    const result = await db.query(
      `DELETE FROM saved_jobs 
       WHERE user_id = $1 AND job_id = $2
       RETURNING id`,
      [req.userId, jobId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Saved job not found",
      });
    }

    res.json({ message: "Job removed from saved list" });
  } catch (error) {
    console.error("Delete saved job error:", error.message);
    res.status(500).json({ error: "Failed to remove saved job" });
  }
};

// ================================
// CHECK IF JOB IS SAVED
// GET /api/saved/check/:jobId
// ================================
const checkIfSaved = async (req, res) => {
  try {
    const { jobId } = req.params;

    const result = await db.query(
      "SELECT id FROM saved_jobs WHERE user_id = $1 AND job_id = $2",
      [req.userId, jobId],
    );

    res.json({
      is_saved: result.rows.length > 0,
    });
  } catch (error) {
    console.error("Check saved error:", error.message);
    res.status(500).json({ error: "Failed to check saved status" });
  }
};

module.exports = { saveJob, getSavedJobs, deleteSavedJob, checkIfSaved };
