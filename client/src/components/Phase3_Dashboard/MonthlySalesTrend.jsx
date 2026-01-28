import React, { useEffect, useState } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  BarChart,
} from "recharts";
import "../styles/DashboardStyles.css";

export default function MonthlySalesTrendDashboard() {
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch available years
  const fetchYears = async () => {
    try {
      const res = await fetch('/api/quantity-sold/years');
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const text = await res.text();
      if (!text || text.trim() === '') {
        console.warn("Empty response from server");
        setYears([]);
        return;
      }
      
      const json = JSON.parse(text);
      setYears(json);
    } catch (err) {
      console.error("Failed to fetch years:", err);
      setYears([]);
    }
  };

  // Fetch monthly sales trend data
  const fetchMonthlySalesTrend = async (year) => {
    try {
      setLoading(true);
      let url = `/api/monthly-sales-trend`;
      
      if (year !== "all") {
        url += `?year=${year}`;
      }

      const res = await fetch(`${url}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const text = await res.text();
      if (!text || text.trim() === '') {
        console.warn("Empty response from server");
        setData([]);
        return;
      }
      
      const json = JSON.parse(text);
      
      if (Array.isArray(json)) {
        setData(json);
      } else {
        console.error("Expected array but got:", json);
        setData([]);
      }
    } catch (err) {
      console.error("Failed to fetch monthly sales trend:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch years on component mount
  useEffect(() => {
    fetchYears();
  }, []);

  // Fetch data whenever selectedYear changes
  useEffect(() => {
    fetchMonthlySalesTrend(selectedYear);
  }, [selectedYear]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">
            {data.month_name} {data.sales_year}
          </p>
          <p className="tooltip-item-blue">
            Revenue: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.total_revenue)}
          </p>
          <p className="tooltip-item-green">
            Orders: <strong>{data.total_orders?.toLocaleString()}</strong>
          </p>
          <p className="tooltip-item-orange">
            Customers: <strong>{data.total_customers?.toLocaleString()}</strong>
          </p>
          <p className="tooltip-item">
            Products: <strong>{data.total_products_sold?.toLocaleString()}</strong>
          </p>
          <p className="tooltip-item">
            Avg Order: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.avg_order_value)}
          </p>
          {data.revenue_growth_pct !== 0 && (
            <p className="tooltip-item" style={{ 
              color: data.revenue_growth_pct > 0 ? '#10b981' : '#ef4444' 
            }}>
              Growth: {data.revenue_growth_pct > 0 ? '+' : ''}{parseFloat(data.revenue_growth_pct).toFixed(2)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate summary statistics
  const calculateStats = () => {
    if (data.length === 0) return { 
      totalRevenue: 0, 
      totalOrders: 0, 
      totalCustomers: 0, 
      totalProducts: 0,
      avgMonthlyRevenue: 0,
      avgGrowthRate: 0,
      bestMonth: "-",
      totalMonths: 0
    };
    
    const totalRevenue = data.reduce((sum, item) => sum + parseFloat(item.total_revenue || 0), 0);
    const totalOrders = data.reduce((sum, item) => sum + parseInt(item.total_orders || 0), 0);
    const totalCustomers = data.reduce((sum, item) => sum + parseInt(item.total_customers || 0), 0);
    const totalProducts = data.reduce((sum, item) => sum + parseInt(item.total_products_sold || 0), 0);
    const avgMonthlyRevenue = data.length > 0 ? totalRevenue / data.length : 0;
    
    // Calculate average growth rate (excluding first month which is 0)
    const growthRates = data.slice(1).map(item => parseFloat(item.revenue_growth_pct || 0));
    const avgGrowthRate = growthRates.length > 0 
      ? growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length 
      : 0;
    
    // Find best performing month
    const bestMonthData = data.reduce((max, item) => 
      parseFloat(item.total_revenue) > parseFloat(max.total_revenue || 0) ? item : max
    , { total_revenue: 0 });
    
    const bestMonth = bestMonthData.month_name 
      ? `${bestMonthData.month_name.trim()} ${bestMonthData.sales_year}` 
      : "-";
    
    return { 
      totalRevenue, 
      totalOrders, 
      totalCustomers, 
      totalProducts, 
      avgMonthlyRevenue, 
      avgGrowthRate,
      bestMonth,
      totalMonths: data.length
    };
  };

  const stats = calculateStats();

  // Format month name for display
  const formatMonthLabel = (monthName, monthNumber) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNumber - 1] || monthName;
  };

  // Create display label for X-axis (month + year for all years view)
  const createMonthLabel = (item) => {
    const monthShort = formatMonthLabel(null, item.sales_month);
    return selectedYear === "all" ? `${monthShort} ${item.sales_year}` : monthShort;
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Monthly Sales Trend Dashboard</h2>

      {/* Year Selection Dropdown */}
      <div className="year-selection">
        <label htmlFor="year-select" className="year-label">
          Select Year:
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="year-select"
        >
          <option value="all">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <h3 className="dashboard-subtitle">
        {selectedYear === "all" ? "All Time Performance" : `Performance in ${selectedYear}`}
      </h3>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">Loading sales trend data...</div>
      ) : data.length === 0 ? (
        <div className="empty-state">No data available for the selected year</div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card summary-card-purple">
              <h4 className="card-title">Total Revenue</h4>
              <p className="card-value">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(stats.totalRevenue)}
              </p>
            </div>
            
            <div className="summary-card summary-card-pink">
              <h4 className="card-title">Total Orders</h4>
              <p className="card-value">{stats.totalOrders.toLocaleString()}</p>
            </div>
            
            <div className="summary-card summary-card-blue">
              <h4 className="card-title">Avg Monthly Revenue</h4>
              <p className="card-value">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(stats.avgMonthlyRevenue)}
              </p>
            </div>

            <div className="summary-card summary-card-orange">
              <h4 className="card-title">Avg Growth Rate</h4>
              <p className="card-value">
                {stats.avgGrowthRate > 0 ? '+' : ''}{stats.avgGrowthRate.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Revenue & Orders Combined Chart */}
          <div className="chart-container">
            <h4 className="section-title">Revenue & Orders Trend</h4>
            <ResponsiveContainer width="100%" height={450}>
              <ComposedChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 60 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="sales_month"
                  tickFormatter={(month, index) => {
                    const item = data[index];
                    return item ? createMonthLabel(item) : '';
                  }}
                  angle={selectedYear === "all" ? -45 : 0}
                  textAnchor={selectedYear === "all" ? "end" : "middle"}
                  height={selectedYear === "all" ? 80 : 40}
                  style={{ fontSize: "11px", fill: "#666" }}
                />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={(value) => {
                    if (value >= 1_000_000) return "$" + (value / 1_000_000).toFixed(1) + "M";
                    if (value >= 1_000) return "$" + (value / 1_000).toFixed(1) + "K";
                    return "$" + value;
                  }}
                  style={{ fontSize: "12px", fill: "#666" }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  style={{ fontSize: "12px", fill: "#666" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="total_revenue"
                  fill="url(#colorRevenue)"
                  stroke="#667eea"
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="total_orders"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10b981" }}
                  name="Orders"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

           {/* Growth Rate Chart */}
          <div className="chart-container">
            <h4 className="section-title">Month-over-Month Revenue Growth</h4>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="sales_month"
                  tickFormatter={(month, index) => {
                    const item = data[index];
                    return item ? createMonthLabel(item) : '';
                  }}
                  angle={selectedYear === "all" ? -45 : 0}
                  textAnchor={selectedYear === "all" ? "end" : "middle"}
                  height={selectedYear === "all" ? 80 : 40}
                  style={{ fontSize: "11px", fill: "#6b7280" }}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  style={{ fontSize: "12px", fill: "#6b7280" }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const growthValue = parseFloat(data.revenue_growth_pct || 0);
                      return (
                        <div className="custom-tooltip">
                          <p className="tooltip-title">
                            {data.month_name} {data.sales_year}
                          </p>
                          <p style={{ 
                            margin: '4px 0', 
                            fontSize: '14px',
                            color: growthValue >= 0 ? '#10b981' : '#ef4444',
                            fontWeight: 'bold'
                          }}>
                            Growth: {growthValue > 0 ? '+' : ''}{growthValue.toFixed(2)}%
                          </p>
                          <p className="tooltip-item">
                            Revenue: {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(data.total_revenue)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="revenue_growth_pct" 
                  radius={[6, 6, 0, 0]}
                  name="Growth %"
                >
                  {data.map((entry, index) => {
                    const growthValue = parseFloat(entry.revenue_growth_pct || 0);
                    return (
                      <rect
                        key={`bar-${index}`}
                        fill={growthValue >= 0 ? '#10b981' : '#ef4444'}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Customers and Products Charts */}
          <div className="chart-grid">
            {/* Monthly Customers */}
            <div className="chart-card">
              <h4 className="section-title">Monthly Customers</h4>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 60 }}>
                  <defs>
                    <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="sales_month" 
                    tickFormatter={(month, index) => {
                      const item = data[index];
                      return item ? createMonthLabel(item) : '';
                    }}
                    angle={selectedYear === "all" ? -45 : 0}
                    textAnchor={selectedYear === "all" ? "end" : "middle"}
                    height={selectedYear === "all" ? 80 : 40}
                    style={{ fontSize: "11px", fill: "#6b7280" }}
                  />
                  <YAxis style={{ fontSize: "12px", fill: "#6b7280" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="total_customers" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#10b981" }}
                    activeDot={{ r: 6 }}
                    fill="url(#colorCustomers)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Products Sold */}
            <div className="chart-card">
              <h4 className="section-title">Products Sold</h4>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                  <defs>
                    <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.85}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="sales_month" 
                    tickFormatter={(month, index) => {
                      const item = data[index];
                      return item ? createMonthLabel(item) : '';
                    }}
                    angle={selectedYear === "all" ? -45 : 0}
                    textAnchor={selectedYear === "all" ? "end" : "middle"}
                    height={selectedYear === "all" ? 80 : 40}
                    style={{ fontSize: "11px", fill: "#6b7280" }}
                  />
                  <YAxis style={{ fontSize: "12px", fill: "#6b7280" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="total_products_sold" 
                    fill="url(#colorProducts)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average Order Value Chart */}
          <div className="chart-container">
            <h4 className="section-title">Average Order Value Trend</h4>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 60 }}>
                <defs>
                  <linearGradient id="colorAvgOrder" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="sales_month" 
                  tickFormatter={(month, index) => {
                    const item = data[index];
                    return item ? createMonthLabel(item) : '';
                  }}
                  angle={selectedYear === "all" ? -45 : 0}
                  textAnchor={selectedYear === "all" ? "end" : "middle"}
                  height={selectedYear === "all" ? 80 : 40}
                  style={{ fontSize: "11px", fill: "#6b7280" }}
                />
                <YAxis 
                  tickFormatter={(value) => {
                    if (value >= 1_000) return "$" + (value / 1_000).toFixed(1) + "K";
                    return "$" + value;
                  }}
                  style={{ fontSize: "12px", fill: "#6b7280" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="avg_order_value"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#colorAvgOrder)"
                  dot={{ r: 4, fill: "#8b5cf6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div className="table-container">
            <h4 className="section-title">Detailed Monthly Breakdown</h4>
            <table className="data-table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Month</th>
                  <th className="table-header-cell-center">Year</th>
                  <th className="table-header-cell-right">Revenue</th>
                  <th className="table-header-cell-right">Orders</th>
                  <th className="table-header-cell-right">Customers</th>
                  <th className="table-header-cell-right">Products</th>
                  <th className="table-header-cell-right">Avg Order</th>
                  <th className="table-header-cell-right">Growth %</th>
                </tr>
              </thead>
              <tbody>
                {data.map((month, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell-bold">{month.month_name}</td>
                    <td className="table-cell-center">{month.sales_year}</td>
                    <td className="table-cell-green">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(month.total_revenue)}
                    </td>
                    <td className="table-cell-right">{parseInt(month.total_orders).toLocaleString()}</td>
                    <td className="table-cell-right">{parseInt(month.total_customers).toLocaleString()}</td>
                    <td className="table-cell-right">{parseInt(month.total_products_sold).toLocaleString()}</td>
                    <td className="table-cell-blue">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(month.avg_order_value)}
                    </td>
                    <td className="table-cell-right" style={{
                      color: month.revenue_growth_pct >= 0 ? '#10b981' : '#ef4444',
                      fontWeight: '600'
                    }}>
                      {month.revenue_growth_pct !== 0 
                        ? `${month.revenue_growth_pct > 0 ? '+' : ''}${parseFloat(month.revenue_growth_pct).toFixed(2)}%`
                        : '-'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}