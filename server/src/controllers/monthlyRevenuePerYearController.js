const supabase = require('../config/supabaseClient');

// controllers/monthlyRevenuePerYearController.js
exports.getMonthlyRevenue = async (req, res) => {
  try {
    const { year } = req.query;
    
    const params = year && year !== 'all' 
      ? { p_year: parseInt(year) } 
      : { p_year: null };

    const { data, error } = await supabase.rpc('get_monthly_revenue', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMonthlyRevenueByYear = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return res.status(400).json({ error: 'Year is required' });

    const { data, error } = await supabase.rpc('P2-Quantity Sold By Year', { 
      p_year: parseInt(year),
    });

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMonthlyRevenueComparison = async (req, res) => {
  try {
    const { year1, year2 } = req.query;
    
    if (!year1 || !year2) {
      return res.status(400).json({ error: 'Both year1 and year2 are required' });
    }

    const { data, error } = await supabase.rpc('get_monthly_revenue_comparison', { 
      p_year1: parseInt(year1),
      p_year2: parseInt(year2)
    });

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMonthlyRevenueByCategory = async (req, res) => {
  try {
    const { year, category_id } = req.query;
    
    const params = {
      p_year: year && year !== 'all' ? parseInt(year) : null,
      p_category_id: category_id ? parseInt(category_id) : null
    };

    const { data, error } = await supabase.rpc('get_monthly_revenue_by_category', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMonthlyRevenueYears = async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('get_monthly_revenue', { p_year: null });

    if (error) return res.status(500).json(error);

    // Extract unique years from the data
    const yearsSet = new Set();
    data.forEach(row => {
      if (row.year) yearsSet.add(row.year);
    });
    
    const years = Array.from(yearsSet).sort((a, b) => a - b);
    res.json(years);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMonthlyRevenueGrowth = async (req, res) => {
  try {
    const { year } = req.query;
    
    const params = year && year !== 'all' 
      ? { p_year: parseInt(year) } 
      : { p_year: null };

    const { data, error } = await supabase.rpc('get_monthly_revenue_growth', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};