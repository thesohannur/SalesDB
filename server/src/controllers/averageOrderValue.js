const supabase = require('../config/supabaseClient');

exports.getAverageOrderValue = async (req, res) => {
  try {
    const { year } = req.query;
    
    const params = year && year !== 'all' 
      ? { p_year: parseInt(year) } 
      : { p_year: null };

    const { data, error } = await supabase.rpc('get_average_order_value', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};