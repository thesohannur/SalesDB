const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const salesController = require('../controllers/salesController');
const revenueDashboardController = require('../controllers/revenueDashboardController');
const monthlyRevenuePerYearController = require('../controllers/monthlyRevenuePerYearController');
const MonthlyOrderCountController = require('../controllers/MonthlyOrderCountController');
const MonthlySalesTrendController = require('../controllers/MonthlySalesTrend');
const averageOrderValueController = require('../controllers/averageOrderValueController');
const customerLifetimeValue = require('../controllers/customerLifetimeValue');

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

// -- Monthly Revenue Per Year Dashboard --
router.get('/monthly-revenue', monthlyRevenuePerYearController.getMonthlyRevenue);
router.get('/monthly-revenue/years', monthlyRevenuePerYearController.getMonthlyRevenueYears);
router.get('/monthly-revenue/by-category', monthlyRevenuePerYearController.getMonthlyRevenueByCategory);
router.get('/monthly-revenue/comparison', monthlyRevenuePerYearController.getMonthlyRevenueComparison);
router.get('/monthly-revenue/growth', monthlyRevenuePerYearController.getMonthlyRevenueGrowth);

// -- Monthly Order Count Dashboard --
router.get('/monthly-order-count', MonthlyOrderCountController.getMonthlyOrderCount);
router.get('/monthly-order-count/by-year', MonthlyOrderCountController.getMonthlyOrderCountByYear);
router.get('/monthly-order-count/by-category', MonthlyOrderCountController.getMonthlyOrderCountByCategory);
router.get('/monthly-order-count/by-seller', MonthlyOrderCountController.getMonthlyOrderCountBySeller);
router.get('/monthly-order-count/growth', MonthlyOrderCountController.getMonthlyOrderGrowth);

// -- Monthly Sales Trend Dashboard --
router.get('/monthly-sales-trend', MonthlySalesTrendController.getMonthlySalesTrend);
router.get('/monthly-sales-trend/by-category', MonthlySalesTrendController.getMonthlySalesTrendByCategory);
router.get('/monthly-sales-trend/growth', MonthlySalesTrendController.getMonthlySalesTrendByProduct);

// -- Average Order Value Dashboard --
router.get('/average-order-value', averageOrderValueController.getAverageOrderValue);
router.get('/average-order-value/years', averageOrderValueController.getAverageOrderValueYears);
router.get('/average-order-value/by-year', averageOrderValueController.getAverageOrderValueByYear);
router.get('/average-order-value/by-seller', averageOrderValueController.getAverageOrderValueBySeller);
router.get('/average-order-value/by-category', averageOrderValueController.getAverageOrderValueByCategory);

// -- Customer Lifetime Value Dashboard --
router.get('/customer-lifetime-value', customerLifetimeValue.getCustomerLifetimeValue);
router.get('/customer-lifetime-value/years', customerLifetimeValue.getCustomerLifetimeValueYears);
router.get('/customer-lifetime-value/by-year', customerLifetimeValue.getCustomerLifetimeValueByYear);
router.get('/customer-lifetime-value/by-segment', customerLifetimeValue.getCustomerLifetimeValueBySegment);
router.get('/customer-lifetime-value/by-location', customerLifetimeValue.getCustomerLifetimeValueByLocation);

module.exports = router;