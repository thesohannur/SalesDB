const supabase = require('../config/supabaseClient');

exports.getOverviewSummary = async (req, res) => {
  try {
    // Fetch aggregated data for summary cards
    // 1. Total Revenue & Orders from daily_sales_view
    const { data: salesData, error: salesError } = await supabase
      .from('daily_sales_view')
      .select('sales_amount, total_orders, items_sold');

    if (salesError) throw salesError;

    const summary = salesData.reduce((acc, curr) => ({
      totalRevenue: acc.totalRevenue + (parseFloat(curr.sales_amount) || 0),
      totalOrders: acc.totalOrders + (parseInt(curr.total_orders) || 0),
      totalItems: acc.totalItems + (parseInt(curr.items_sold) || 0)
    }), { totalRevenue: 0, totalOrders: 0, totalItems: 0 });

    // 2. Recent Activity (Last 5 daily sales entries as placeholder for activity)
    const { data: recentActivity, error: activityError } = await supabase
      .from('daily_sales_view')
      .select('*')
      .order('sales_date', { ascending: false })
      .limit(5);

    // 3. Active Sellers Count (Using RPC)
    const { data: sellersData, error: sellersError } = await supabase.rpc('get_revenue_per_seller', { p_year: null });
    const { count: totalSellersCount } = await supabase.from('sellers').select('*', { count: 'exact', head: true });
    
    if (sellersError) {
      console.warn("Error calling get_revenue_per_seller in overview:", sellersError.message);
    }
    // 4. Overall business health metrics
    const health = {
      salesVolume: summary.totalRevenue > 100000 ? 'Exceeding Targets' : 'Below Targets',
      riskLevel: 'Low',
      activeUsers: sellersData?.length || 0,
      totalSellers: totalSellersCount || 50
    };

    res.json({
      ...summary,
      recentActivity: recentActivity || [],
      health,
      activeSellers: sellersData?.length || 0,
      businessDescription: "SalesDB is a premium data intelligence platform designed to streamline sales tracking and performance analytics. Our mission is to provide actionable insights through real-time data visualization and advanced database logic."
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
