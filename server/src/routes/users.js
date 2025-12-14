const express = require("express");
const router = express.Router();
const { getAllUsers, addUser } = require("../controllers/userController");

router.get("/", getAllUsers);

module.exports = router;
