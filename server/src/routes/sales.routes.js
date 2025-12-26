const express = require("express");
const router = express.Router();
const { getMonthlySales } = require("../services/sales.service");

router.get("/monthly-sales/:year", async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const result = await getMonthlySales(year);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
