const { Pool } = require("pg");

console.log("DB URL exists:", !!process.env.DATABASE_URL); // Debug check

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    console.error("❌ Full error:", err);
  } else {
    console.log("✅ Database connected successfully!");
    release();
  }
});

module.exports = pool;
