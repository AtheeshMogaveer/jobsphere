const { Pool } = require("pg");
require("dotenv").config();

// WHY Pool instead of single connection?
// Each API request needs a DB connection.
// Opening + closing a connection takes ~50ms.
// With 1000 users/second that's 50 seconds of wasted time per second!
// Pool keeps 10 connections READY and reuses them instantly.

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase SSL connection
  },
  max: 10, // Maximum 10 connections in pool
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Fail fast if can't connect in 2s
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Database connected successfully!");
    release(); // Return connection back to pool
  }
});

module.exports = pool;
