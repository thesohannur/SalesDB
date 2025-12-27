const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// -- Total Sales Per Date (Daily Sales)
router.get('/daily-sales', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('daily_sales_view') 
      .select('*');  

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch daily sales' });
  }
});

module.exports = router;
