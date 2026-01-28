const supabase = require('../config/supabaseClient');

// Phase 4: Inactive Sellers
exports.getInactiveSellers = async (req, res) => {
  try {
    const { startMonth, endMonth } = req.query;

    // Validate required parameters
    if (!startMonth || !endMonth) {
      return res.status(400).json({ 
        error: 'startMonth and endMonth are required (format: YYYY-MM)' 
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!dateRegex.test(startMonth) || !dateRegex.test(endMonth)) {
      return res.status(400).json({ 
        error: 'Invalid date format. Use YYYY-MM (e.g., 2023-01)' 
      });
    }

    // Convert to full dates (first day of start month, last day of end month)
    const [startYear, startMonthNum] = startMonth.split('-');
    const [endYear, endMonthNum] = endMonth.split('-');
    const startDate = `${startMonth}-01`;
    const lastDay = new Date(parseInt(endYear), parseInt(endMonthNum), 0).getDate();
    const endDate = `${endMonth}-${lastDay}`;

    // Validate date range
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ 
        error: 'Start date must be before or equal to end date' 
      });
    }

    // Call Supabase RPC function
    const { data, error } = await supabase.rpc('get_inactive_sellers_analytics', {
      p_start_date: startDate,
      p_end_date: endDate
    });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Inactive Sellers Analytics Error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch inactive sellers analytics',
      details: err.message 
    });
  }
};

// Phase 5: Returns & Risk Analytics
exports.getReturnAnalytics = async (req, res) => {
  try {
    const { year, month, type = 'all' } = req.query; // type: all, year, month
    
    // Query our new flexible view
    let { data, error } = await supabase.from('product_returns_analytics').select('*');

    if (error) {
      console.warn("product_returns_analytics view not found, returning empty set");
      return res.json([]);
    }

    // Aggregation Logic based on type
    let result = [];

    if (type === 'all') {
      // Group by Product ID for all-time
      const grouped = data.reduce((acc, curr) => {
        if (!acc[curr.product_id]) {
          acc[curr.product_id] = { ...curr, total_sold: 0, total_returned: 0, revenue_lost: 0 };
        }
        acc[curr.product_id].total_sold += parseInt(curr.total_sold);
        acc[curr.product_id].total_returned += parseInt(curr.total_returned);
        acc[curr.product_id].revenue_lost += parseFloat(curr.revenue_lost);
        return acc;
      }, {});
      
      result = Object.values(grouped).map(item => ({
        ...item,
        return_rate: item.total_sold > 0 ? (item.total_returned / item.total_sold) * 100 : 0
      }));
    } 
    else if (type === 'year') {
      // Filter by specific year or show year-over-year summary
      if (year && year !== 'all') {
        result = data.filter(item => item.sales_year === parseInt(year));
      } else {
        // Group by year for global trend
        const groupedYear = data.reduce((acc, curr) => {
          if (!acc[curr.sales_year]) acc[curr.sales_year] = { period: curr.sales_year, total_sold: 0, total_returned: 0, revenue_lost: 0 };
          acc[curr.sales_year].total_sold += parseInt(curr.total_sold);
          acc[curr.sales_year].total_returned += parseInt(curr.total_returned);
          acc[curr.sales_year].revenue_lost += parseFloat(curr.revenue_lost);
          return acc;
        }, {});
        result = Object.values(groupedYear).map(item => ({
          ...item,
          return_rate: (item.total_returned / item.total_sold) * 100
        })).sort((a,b) => b.period - a.period);
      }
    }
    else if (type === 'month') {
      // Filter by specific year and month or show month-over-month
      if (year && year !== 'all') {
        result = data.filter(item => item.sales_year === parseInt(year));
        if (month && month !== 'all') {
          result = result.filter(item => item.sales_month === parseInt(month));
        }
      } else {
        result = data;
      }
    }

    // Filter to only show products that HAVE returns (declutter the UI)
    const filteredResult = result.filter(item => item.total_returned > 0);

    res.json(filteredResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
