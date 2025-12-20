const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Supabase requires SSL. This allows connection from your local machine.
    rejectUnauthorized: false 
  },
  // Optional: Supabase free tier has a limit on connections. 
  // Setting a max helps prevent "too many connections" errors.
  max: 10, 
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

module.exports = pool;