const supabase = require('../config/supabaseClient');

const viewMap = {
  product: 'total_quantity_sold_per_product',
  year: 'quantity_sold_by_year',
  category: 'quantity_sold_by_category',
  category_year: 'quantity_sold_by_category_year',
};

exports.getQuantitySold = async (req, res) => {
  try {
    let { type = 'product', year } = req.query;

    const viewName = viewMap[type] || viewMap['product'];

    let query = supabase.from(viewName).select('*');

    // If view supports year filtering
    if (year && year !== 'all' && (type === 'year' || type === 'category_year')) {
      query = query.gte('sales_year', year).lte('sales_year', year);
    }

    // Execute query
    const { data, error } = await query.order('total_quantity_sold', { ascending: false });

    if (error) return res.status(500).json(error);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getQuantitySoldYears = async (req, res) => {
  const { data, error } = await supabase
    .from('quantity_sold_years')
    .select('*');

  if (error) return res.status(500).json(error);

  res.json(
    data.map(row => row.sales_year)
  );
};
