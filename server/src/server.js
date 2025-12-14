const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
