// controllers/customerLifetimeValueController.js
const supabase = require('../config/supabaseClient');

exports.getCustomerLifetimeValueYears = async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('get_customer_lifetime_value');

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

exports.getCustomerLifetimeValue = async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('get_customer_lifetime_value');

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCustomerLifetimeValueByYear = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return res.status(400).json({ error: 'Year is required' });

    const { data, error } = await supabase.rpc(
      'get_customer_lifetime_value_by_year',
      { p_year: parseInt(year) }
    );

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCustomerLifetimeValueBySegment = async (req, res) => {
  try {
    const { year } = req.query;

    const params =
      year && year !== 'all'
        ? { p_year: parseInt(year) }
        : { p_year: null };

    const { data, error } = await supabase.rpc(
      'get_customer_lifetime_value_by_segment',
      params
    );

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCustomerLifetimeValueByLocation = async (req, res) => {
  try {
    const { year } = req.query;

    const params =
      year && year !== 'all'
        ? { p_year: parseInt(year) }
        : { p_year: null };

    const { data, error } = await supabase.rpc(
      'get_customer_lifetime_value_by_location',
      params
    );

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
