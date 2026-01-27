const supabase = require('../config/supabaseClient');

// controllers/monthlyOrderCountController.js
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

exports.getMonthlyOrderCountByYear = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return res.status(400).json({ error: 'Year is required' });

    const { data, error } = await supabase.rpc('get_monthly_order_count_by_year', { 
      p_year: parseInt(year),
    });

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMonthlyOrderCountByCategory = async (req, res) => {
  try {
    const { year, category_id } = req.query;
    
    const params = {
      p_year: year && year !== 'all' ? parseInt(year) : null,
      p_category_id: category_id ? parseInt(category_id) : null
    };

    const { data, error } = await supabase.rpc('get_monthly_order_count_by_category', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMonthlyOrderCountBySeller = async (req, res) => {
  try {
    const { year, seller_id } = req.query;
    
    const params = {
      p_year: year && year !== 'all' ? parseInt(year) : null,
      p_seller_id: seller_id ? parseInt(seller_id) : null
    };

    const { data, error } = await supabase.rpc('get_monthly_order_count_by_seller', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMonthlyOrderGrowth = async (req, res) => {
  try {
    const { year } = req.query;
    
    const params = year && year !== 'all' 
      ? { p_year: parseInt(year) } 
      : { p_year: null };

    const { data, error } = await supabase.rpc('get_monthly_order_growth', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};