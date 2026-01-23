const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const salesController = require('../controllers/salesController');
const revenueDashboardController = require('../controllers/revenueDashboardController')

// -- Total Sales Per Date (Daily Sales) --
router.get('/daily-sales', async (req, res) => {
  const { year } = req.query;

  let query = supabase
    .from('daily_sales_view')
    .select('*')
    .order('sales_date');

  if (year && year !== 'all') {
    query = query
      .gte('sales_date', `${year}-01-01`)
      .lte('sales_date', `${year}-12-31`);
  }

  const { data, error } = await query;

  if (error) return res.status(500).json(error);

  res.json(data);
});


router.get('/daily-sales/years', async (req, res) => {
  const { data, error } = await supabase
    .from('daily_sales_years')
    .select('*');

  if (error) return res.status(500).json(error);

  res.json(data);
});

// -- Quantity Sold Dashboard --
router.get('/quantity-sold', salesController.getQuantitySold);
router.get('/quantity-sold/years', salesController.getQuantitySoldYears);

// -- Revenue Dashboard --
router.get('/revenue-per-product', revenueDashboardController.getRevenuePerProduct);
router.get('/totalrevenue', revenueDashboardController.getTotalRevenue);
router.get('/revenue-per-seller', revenueDashboardController.getRevenuePerSeller);
router.get('/revenue-per-category', revenueDashboardController.getRevenuePerCategory);

// -- top selling dashboard (niloy)


module.exports = router;
