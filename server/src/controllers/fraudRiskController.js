const supabase = require('../config/supabaseClient');

// Multiple Failed Payments
exports.getMultipleFailedPayments = async (req, res) => {
  try {
    const { days = 15, min_attempts = 2 } = req.query;
    
    const params = {
      p_days: parseInt(days),
      p_min_attempts: parseInt(min_attempts)
    };

    const { data, error } = await supabase.rpc('get_multiple_failed_payments', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// High Return Rate Customers
exports.getHighReturnCustomers = async (req, res) => {
  try {
    const { min_returns = 3, min_percentage = 10 } = req.query;
    
    const params = {
      p_min_returns: parseInt(min_returns),
      p_min_percentage: parseFloat(min_percentage)
    };

    const { data, error } = await supabase.rpc('get_high_return_customers', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Seller High Returns Recent
exports.getSellerHighReturnsRecent = async (req, res) => {
  try {
    const { days = 30, min_items = 10, min_return_rate = 0.30 } = req.query;
    
    const params = {
      p_days: parseInt(days),
      p_min_items: parseInt(min_items),
      p_min_return_rate: parseFloat(min_return_rate)
    };

    const { data, error } = await supabase.rpc('get_seller_high_returns_recent', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Seller High Returns All Time
exports.getSellerHighReturnsAllTime = async (req, res) => {
  try {
    const { min_items = 10, min_return_rate = 0.30 } = req.query;
    
    const params = {
      p_min_items: parseInt(min_items),
      p_min_return_rate: parseFloat(min_return_rate)
    };

    const { data, error } = await supabase.rpc('get_seller_high_returns_alltime', params);

    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};