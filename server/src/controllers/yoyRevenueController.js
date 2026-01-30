const supabase = require('../config/supabaseClient');

/**
 * Get Revenue Decrease Ratio (Year-over-Year comparison)
 * Calls the PostgreSQL function get_revenue_decrease_ratio
 */
exports.getRevenueDecreaseRatio = async (req, res) => {
  try {
    // Call the PostgreSQL function
    const { data, error } = await supabase
      .rpc('get_revenue_decrease_ratio');

    if (error) {
      console.error('Error fetching revenue decrease ratio:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get Year-over-Year Revenue Growth (detailed analysis)
 * Calls the PostgreSQL function get_yoy_revenue_growth
 */
exports.getYoYRevenueGrowth = async (req, res) => {
  try {
    const { year } = req.query;
    
    // Call the PostgreSQL function
    const { data, error } = await supabase
      .rpc('get_yoy_revenue_growth', {
        p_year: year && year !== 'all' ? parseInt(year) : null
      });

    if (error) {
      console.error('Error fetching YoY revenue growth:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get Monthly Year-over-Year Comparison
 * Calls the PostgreSQL function get_monthly_yoy_comparison
 */
exports.getMonthlyYoYComparison = async (req, res) => {
  try {
    const { year } = req.query;
    
    // Call the PostgreSQL function
    const { data, error } = await supabase
      .rpc('get_monthly_yoy_comparison', {
        p_year: year && year !== 'all' ? parseInt(year) : null
      });

    if (error) {
      console.error('Error fetching monthly YoY comparison:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
