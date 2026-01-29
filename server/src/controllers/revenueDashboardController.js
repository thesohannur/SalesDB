const supabase = require('../config/supabaseClient');

// controllers/revenueDashboardController.js
exports.getTotalRevenue = async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('get_revenue_per_product'); 
    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getRevenuePerProduct = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return res.status(400).json({ error: 'Year is required' });

    const { data, error } = await supabase.rpc('get_revenue_per_product_by_year', { 
      p_year: parseInt(year),
    });

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getRevenuePerSeller = async (req, res) => {
  try {
    const { year } = req.query;
    
    const params = year && year !== 'all' 
      ? { p_year: parseInt(year) } 
      : { p_year: null };

    const { data, error } = await supabase.rpc('get_revenue_per_seller', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getRevenuePerCategory = async (req, res) => {
  try {
    const { year } = req.query;
    
    const params = year && year !== 'all' 
      ? { p_year: parseInt(year) } 
      : { p_year: null };

    const { data, error } = await supabase.rpc('get_revenue_per_category', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMonthlyRevenuePerYear = async (req, res) => {
  try {
    const { year } = req.query;
    
    const params = year && year !== 'all' 
      ? { p_year: parseInt(year) } 
      : { p_year: null };

    const { data, error } = await supabase.rpc('get_monthly_revenue_per_year', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMonthlyOrderCount = async (req, res) => {
  try {
    const { year } = req.query;
    
    const params = year && year !== 'all' 
      ? { p_year: parseInt(year) } 
      : { p_year: null };

    const { data, error } = await supabase.rpc('get_monthly_order_count', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMonthlySalesTrend = async (req, res) => {
  try {
    const { year } = req.query;
    
    const params = year && year !== 'all' 
      ? { p_year: parseInt(year) } 
      : { p_year: null };

    const { data, error } = await supabase.rpc('get_monthly_sales_trend', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
