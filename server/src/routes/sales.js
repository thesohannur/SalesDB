const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const salesController = require('../controllers/salesController');
const revenueDashboardController = require('../controllers/revenueDashboardController');
const overviewController = require('../controllers/overviewController');
const analyticsController = require('../controllers/analyticsController');
const aovController = require('../controllers/averageOrderValue')
const cltvController = require('../controllers/cltvController')
const profitMarginController = require('../controllers/profitMarginController');
const yoyRevenueController = require('../controllers/yoyRevenueController');
const fraudRiskController = require('../controllers/fraudRiskController');
const revenueDropAnalysisController = require('../controllers/revenueDropAnalysisController');

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

// -- Overview Dashboard --
router.get('/overview/summary', overviewController.getOverviewSummary);

// -- Phase 4 & 5 Analytics --
router.get('/analytics/inactive-sellers', analyticsController.getInactiveSellers);
router.get('/analytics/returns', analyticsController.getReturnAnalytics);

//-- Monthly Revenue
router.get('/monthly-revenue', revenueDashboardController.getMonthlyRevenuePerYear);

// -- Monthly Order Count --
router.get('/monthly-order-count', revenueDashboardController.getMonthlyOrderCount);

// -- Monthly Sales Trend --
router.get('/monthly-sales-trend', revenueDashboardController.getMonthlySalesTrend);

//-- Average Order Value
router.get('/average-order-value', aovController.getAverageOrderValue);

// -- Customer Lifetime Value --
router.get('/customer-lifetime-value', cltvController.getCustomerLifetimeValue);

// -- Profit Margin Analytics --
router.get('/profit-margin/product', profitMarginController.getProductProfitMargin);
router.get('/profit-margin/category', profitMarginController.getCategoryProfitMargin);


// -- Year-over-Year Revenue Analysis --
router.get('/yoy/revenue-decrease-ratio', yoyRevenueController.getRevenueDecreaseRatio);
router.get('/yoy/revenue-growth', yoyRevenueController.getYoYRevenueGrowth);
router.get('/yoy/monthly-comparison', yoyRevenueController.getMonthlyYoYComparison);

// -- Fraud & Risk Monitoring --
router.get('/fraud/failed-payments', fraudRiskController.getMultipleFailedPayments);
router.get('/fraud/high-return-customers', fraudRiskController.getHighReturnCustomers);
router.get('/fraud/seller-returns-recent', fraudRiskController.getSellerHighReturnsRecent);
router.get('/fraud/seller-returns-alltime', fraudRiskController.getSellerHighReturnsAllTime);

// -- Revenue Drop Analysis --
router.get('/revenue-drop/monthly', revenueDropAnalysisController.getMonthlyRevenueDropAnalysis);
router.get('/revenue-drop/yearly', revenueDropAnalysisController.getYearlyRevenueDropAnalysis);
router.get('/revenue-drop/weekly', revenueDropAnalysisController.getWeeklyRevenueDropAnalysis);

module.exports = router;
