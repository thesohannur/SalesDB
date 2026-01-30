const supabase = require('../config/supabaseClient');

/**
 * Get Product Profit Margin
 * Calls the PostgreSQL function get_product_profit_margin
 */
exports.getProductProfitMargin = async (req, res) => {
  try {
    const { year } = req.query;
    
    // Call the PostgreSQL function
    const { data, error } = await supabase
      .rpc('get_product_profit_margin', {
        p_year: year && year !== 'all' ? parseInt(year) : null
      });

    if (error) {
      console.error('Error fetching product profit margin:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get Category Profit Margin
 * Calls the PostgreSQL function get_category_profit_margin
 */
exports.getCategoryProfitMargin = async (req, res) => {
  try {
    const { year } = req.query;
    
    // Call the PostgreSQL function
    const { data, error } = await supabase
      .rpc('get_category_profit_margin', {
        p_year: year && year !== 'all' ? parseInt(year) : null
      });

    if (error) {
      console.error('Error fetching category profit margin:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};