// server/src/db/database.js
// for localhost
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "salesdb",
  password: "yourpassword",
  port: 5432,
});

module.exports = pool;
