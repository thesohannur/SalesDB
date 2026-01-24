const supabase = require('../config/supabaseClient');

// controllers/bestSellingCategoryController.js
exports.getBestSellingCategoryPerState = async (req, res) => {
  try {
    const { year } = req.query;
    
    const params = year && year !== 'all' 
      ? { p_year: parseInt(year) } 
      : { p_year: null };

    const { data, error } = await supabase.rpc('P3-Quantity Sold By Category', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBestSellingCategoryByState = async (req, res) => {
  try {
    const { division, year } = req.query;
    
    if (!division) return res.status(400).json({ error: 'Division is required' });

    const params = {
      p_division: division,
      p_year: year && year !== 'all' ? parseInt(year) : null
    };

    const { data, error } = await supabase.rpc('P3-Quantity Sold By Category And Year', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCategorySalesByState = async (req, res) => {
  try {
    const { year, limit } = req.query;
    
    const params = {
      p_year: year && year !== 'all' ? parseInt(year) : null,
      p_limit: limit ? parseInt(limit) : 10
    };

    const { data, error } = await supabase.rpc('P3-Quantity Sold By Category And Year', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStateWiseCategoryPerformance = async (req, res) => {
  try {
    const { category_id, year } = req.query;
    
    if (!category_id) return res.status(400).json({ error: 'Category ID is required' });

    const params = {
      p_category_id: parseInt(category_id),
      p_year: year && year !== 'all' ? parseInt(year) : null
    };

    const { data, error } = await supabase.rpc('StateWiseCategoryPerformance', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};