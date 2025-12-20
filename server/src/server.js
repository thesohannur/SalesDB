const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const pool = require("./db/databasepg");

const app = express();

app.use(cors());
app.use(express.json());

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to Render PostgreSQL!");
    release();
  }
});

// Make database available to routes
app.locals.db = pool;

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});