const axios = require("axios");
const db = require("../config/db");

// ================================
// SEARCH JOBS
// GET /api/jobs/search
// Query params: query, location, employment_type, page
// ================================
const searchJobs = async (req, res) => {
  try {
    const {
      query, // e.g. "React Developer"
      location = "anywhere", // e.g. "Bangalore" or "remote"
      employment_type = "", // FULLTIME, PARTTIME, CONTRACTOR
      page = 1,
    } = req.query;

    // 1. Validate input
    if (!query) {
      return res.status(400).json({
        error: "Search query is required",
      });
    }

    // 2. Call JSearch API
    const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
      params: {
        query: `${query} in ${location}`,
        page: page.toString(),
        num_pages: "1",
        employment_types: employment_type,
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    });

    const jobs = response.data.data;

    // 3. Save search to history (only if user is logged in)
    if (req.userId) {
      await db.query(
        "INSERT INTO search_history (user_id, search_query) VALUES ($1, $2)",
        [req.userId, query],
      );
    }

    // 4. Format and return jobs
    const formattedJobs = jobs.map((job) => ({
      job_id: job.job_id,
      job_title: job.job_title,
      company: job.employer_name,
      company_logo: job.employer_logo,
      location: job.job_city
        ? `${job.job_city}, ${job.job_country}`
        : job.job_country,
      is_remote: job.job_is_remote,
      employment_type: job.job_employment_type,
      salary_min: job.job_min_salary,
      salary_max: job.job_max_salary,
      salary_currency: job.job_salary_currency,
      description: job.job_description?.substring(0, 300) + "...",
      apply_url: job.job_apply_link,
      posted_at: job.job_posted_at_datetime_utc,
      required_skills: job.job_required_skills || [],
      required_education:
        job.job_required_education?.required_credential || null,
    }));

    res.json({
      status: "success",
      total: formattedJobs.length,
      page: parseInt(page),
      jobs: formattedJobs,
    });
  } catch (error) {
    console.error("Search jobs error:", error.message);

    // Handle specific API errors
    if (error.response?.status === 429) {
      return res.status(429).json({
        error: "Too many requests. Please wait a moment.",
      });
    }

    if (error.response?.status === 403) {
      return res.status(403).json({
        error: "API key invalid. Check your RapidAPI key.",
      });
    }

    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// ================================
// SEARCH BY COMPANY
// GET /api/jobs/company/:name
// ================================
const searchByCompany = async (req, res) => {
  try {
    const { name } = req.params;
    const { page = 1 } = req.query;

    const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
      params: {
        query: `jobs at ${name}`,
        page: page.toString(),
        num_pages: "1",
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    });

    const jobs = response.data.data;

    // Save to search history if logged in
    if (req.userId) {
      await db.query(
        "INSERT INTO search_history (user_id, search_query) VALUES ($1, $2)",
        [req.userId, `Company: ${name}`],
      );
    }

    const formattedJobs = jobs.map((job) => ({
      job_id: job.job_id,
      job_title: job.job_title,
      company: job.employer_name,
      company_logo: job.employer_logo,
      location: job.job_city
        ? `${job.job_city}, ${job.job_country}`
        : job.job_country,
      is_remote: job.job_is_remote,
      employment_type: job.job_employment_type,
      description: job.job_description?.substring(0, 300) + "...",
      apply_url: job.job_apply_link,
      posted_at: job.job_posted_at_datetime_utc,
    }));

    res.json({
      status: "success",
      company: name,
      total: formattedJobs.length,
      jobs: formattedJobs,
    });
  } catch (error) {
    console.error("Company search error:", error.message);
    res.status(500).json({ error: "Failed to fetch company jobs" });
  }
};

// ================================
// GET JOB DETAILS
// GET /api/jobs/:id
// ================================
const getJobDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      "https://jsearch.p.rapidapi.com/job-details",
      {
        params: { job_id: id },
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      },
    );

    const job = response.data.data[0];

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({
      status: "success",
      job: {
        job_id: job.job_id,
        job_title: job.job_title,
        company: job.employer_name,
        company_logo: job.employer_logo,
        location: job.job_city
          ? `${job.job_city}, ${job.job_country}`
          : job.job_country,
        is_remote: job.job_is_remote,
        employment_type: job.job_employment_type,
        salary_min: job.job_min_salary,
        salary_max: job.job_max_salary,
        description: job.job_description,
        apply_url: job.job_apply_link,
        posted_at: job.job_posted_at_datetime_utc,
        required_skills: job.job_required_skills || [],
        required_education: job.job_required_education?.required_credential,
        benefits: job.job_benefits || [],
        highlights: job.job_highlights || {},
      },
    });
  } catch (error) {
    console.error("Job details error:", error.message);
    res.status(500).json({ error: "Failed to fetch job details" });
  }
};

// ================================
// GET SEARCH HISTORY
// GET /api/jobs/history
// ================================
const getSearchHistory = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, search_query, searched_at 
       FROM search_history 
       WHERE user_id = $1 
       ORDER BY searched_at DESC 
       LIMIT 20`,
      [req.userId],
    );

    res.json({
      status: "success",
      history: result.rows,
    });
  } catch (error) {
    console.error("Search history error:", error.message);
    res.status(500).json({ error: "Failed to fetch search history" });
  }
};

module.exports = {
  searchJobs,
  searchByCompany,
  getJobDetails,
  getSearchHistory,
};
