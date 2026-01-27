const supabase = require('../config/supabaseClient');

// controllers/MonthlySalesTrend.js

exports.getMonthlySalesTrend = async (req, res) => {
  try {
    const { year } = req.query;

    const params =
      year && year !== 'all'
        ? { p_year: parseInt(year) }
        : { p_year: null };

    const { data, error } = await supabase.rpc(
      'get_monthly_sales_trend',
      params
    );

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMonthlySalesTrendByProduct = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year)
      return res.status(400).json({ error: 'Year is required' });

    const { data, error } = await supabase.rpc(
      'get_monthly_revenue_by_category',
      {
        p_year: parseInt(year),
      }
    );

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMonthlySalesTrendByCategory = async (req, res) => {
  try {
    const { year } = req.query;

    const params =
      year && year !== 'all'
        ? { p_year: parseInt(year) }
        : { p_year: null };

    const { data, error } = await supabase.rpc(
      'get_monthly_revenue_by_category',
      params
    );

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
