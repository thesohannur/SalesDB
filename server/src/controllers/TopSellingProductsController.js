const supabase = require('../config/supabaseClient');

// controllers/topSellingProductsController.js
exports.getTopSellingProducts = async (req, res) => {
  try {
    const { year, limit } = req.query;
    
    const params = {
      p_year: year && year !== 'all' ? parseInt(year) : null,
      p_limit: limit ? parseInt(limit) : 10
    };

    const { data, error } = await supabase.rpc('P3-Total Quantity Sold per Product', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTopSellingProductsByCategory = async (req, res) => {
  try {
    const { year, category, limit } = req.query;
    
    if (!category) return res.status(400).json({ error: 'Category is required' });

    const params = {
      p_year: year && year !== 'all' ? parseInt(year) : null,
      p_category: category,
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

exports.getTopSellingProductsBySeller = async (req, res) => {
  try {
    const { year, seller_id, limit } = req.query;
    
    if (!seller_id) return res.status(400).json({ error: 'Seller ID is required' });

    const params = {
      p_year: year && year !== 'all' ? parseInt(year) : null,
      p_seller_id: parseInt(seller_id),
      p_limit: limit ? parseInt(limit) : 10
    };

    const { data, error } = await supabase.rpc('TopSellingProductsBySeller', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getProductSalesTrend = async (req, res) => {
  try {
    const { product_id, year } = req.query;
    
    if (!product_id) return res.status(400).json({ error: 'Product ID is required' });

    const params = {
      p_product_id: parseInt(product_id),
      p_year: year && year !== 'all' ? parseInt(year) : null
    };

    const { data, error } = await supabase.rpc('P3-Quantity Sold By Year', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};