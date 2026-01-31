const supabase = require('../config/supabaseClient');

/**
 * Get Monthly Revenue Drop Analysis
 * Calls the PostgreSQL function get_monthly_revenue_drop_analysis
 */
exports.getMonthlyRevenueDropAnalysis = async (req, res) => {
  try {
    const { threshold } = req.query;
    
    // Call the PostgreSQL function
    const { data, error } = await supabase
      .rpc('get_monthly_revenue_drop_analysis', {
        p_threshold_percent: threshold ? parseFloat(threshold) : 20
      });

    if (error) {
      console.error('Error fetching monthly revenue drop analysis:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get Yearly Revenue Drop Analysis
 * Calls the PostgreSQL function get_yearly_revenue_drop_analysis
 */
exports.getYearlyRevenueDropAnalysis = async (req, res) => {
  try {
    const { threshold } = req.query;
    
    // Call the PostgreSQL function
    const { data, error } = await supabase
      .rpc('get_yearly_revenue_drop_analysis', {
        p_threshold_percent: threshold ? parseFloat(threshold) : 20
      });

    if (error) {
      console.error('Error fetching yearly revenue drop analysis:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get Weekly Revenue Drop Analysis
 * Calls the PostgreSQL function get_weekly_revenue_drop_analysis
 */
exports.getWeeklyRevenueDropAnalysis = async (req, res) => {
  try {
    const { threshold } = req.query;
    
    // Call the PostgreSQL function
    const { data, error } = await supabase
      .rpc('get_weekly_revenue_drop_analysis', {
        p_threshold_percent: threshold ? parseFloat(threshold) : 20
      });

    if (error) {
      console.error('Error fetching weekly revenue drop analysis:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
