import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import "../styles/DashboardStyles.css";

export default function MonthlyOrderCountDashboard() {
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  // Fetch monthly order count data
  const fetchMonthlyOrderCount = async (year) => {
    try {
      setLoading(true);
      let url = `/api/monthly-order-count`;
      
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
      console.error("Failed to fetch monthly order count:", err);
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
    fetchMonthlyOrderCount(selectedYear);
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
            Orders: <strong>{data.total_orders?.toLocaleString()}</strong>
          </p>
          <p className="tooltip-item-green">
            Customers: <strong>{data.total_customers?.toLocaleString()}</strong>
          </p>
          <p className="tooltip-item-orange">
            Revenue: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.total_revenue)}
          </p>
          <p className="tooltip-item">
            Avg Order: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.avg_order_value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate summary statistics
  const calculateStats = () => {
    if (data.length === 0) return { 
      totalOrders: 0, 
      totalCustomers: 0, 
      totalRevenue: 0, 
      avgMonthlyOrders: 0,
      bestMonth: "-" 
    };
    
    const totalOrders = data.reduce((sum, item) => sum + parseInt(item.total_orders || 0), 0);
    const totalCustomers = data.reduce((sum, item) => sum + parseInt(item.total_customers || 0), 0);
    const totalRevenue = data.reduce((sum, item) => sum + parseFloat(item.total_revenue || 0), 0);
    const avgMonthlyOrders = data.length > 0 ? totalOrders / data.length : 0;
    
    // Find best performing month
    const bestMonthData = data.reduce((max, item) => 
      parseInt(item.total_orders) > parseInt(max.total_orders || 0) ? item : max
    , { total_orders: 0 });
    
    const bestMonth = bestMonthData.month_name 
      ? `${bestMonthData.month_name.trim()} ${bestMonthData.sales_year}` 
      : "-";
    
    return { totalOrders, totalCustomers, totalRevenue, avgMonthlyOrders, bestMonth };
  };

  const stats = calculateStats();

  // Format month name for display
  const formatMonthLabel = (monthName, monthNumber) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNumber - 1] || monthName;
  };

  return (
    <div className="dashboard-container">
      
      <h2 className="dashboard-heading">Monthly Order Count Dashboard</h2>

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

      <h3 className="performance-heading">
        {selectedYear === "all" ? "All Time Performance" : `Performance in ${selectedYear}`}
      </h3>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">Loading monthly order data...</div>
      ) : data.length === 0 ? (
        <div className="empty-state">No data available for the selected year</div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card summary-card-purple">
              <h4 className="card-title">Total Orders</h4>
              <p className="card-value">{stats.totalOrders.toLocaleString()}</p>
            </div>
            
            <div className="summary-card summary-card-pink">
              <h4 className="card-title">Total Customers</h4>
              <p className="card-value">{stats.totalCustomers.toLocaleString()}</p>
            </div>
            
            <div className="summary-card summary-card-blue">
              <h4 className="card-title">Avg Monthly Orders</h4>
              <p className="card-value">{Math.round(stats.avgMonthlyOrders).toLocaleString()}</p>
            </div>

            <div className="summary-card summary-card-orange">
              <h4 className="card-title">Best Month</h4>
              <p className="card-value-small">{stats.bestMonth}</p>
            </div>
          </div>

          {/* Order Count Area Chart */}
          <div className="chart-container">
            <h4 className="section-title">Monthly Order Count Trend</h4>
            <ResponsiveContainer width="100%" height={450}>
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 60 }}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="sales_month"
                  tickFormatter={(month) => formatMonthLabel(null, month)}
                  style={{ fontSize: "12px", fill: "#666" }}
                />
                <YAxis style={{ fontSize: "12px", fill: "#666" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="total_orders"
                  stroke="#667eea"
                  strokeWidth={3}
                  fill="url(#colorOrders)"
                  name="Monthly Orders"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Customers and Revenue Charts */}
          <div className="chart-grid">
            {/* Monthly Customers Chart */}
            <div className="chart-card">
              <h4 className="section-title">Monthly Customers</h4>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                  <defs>
                    <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0.85}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="sales_month" 
                    tickFormatter={(month) => formatMonthLabel(null, month)}
                    style={{ fontSize: "11px", fill: "#6b7280" }}
                  />
                  <YAxis style={{ fontSize: "12px", fill: "#6b7280" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="total_customers" 
                    fill="url(#colorCustomers)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Revenue Chart */}
            <div className="chart-card">
              <h4 className="section-title">Monthly Revenue</h4>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="sales_month" 
                    tickFormatter={(month) => formatMonthLabel(null, month)}
                    style={{ fontSize: "11px", fill: "#6b7280" }}
                  />
                  <YAxis 
                    tickFormatter={(value) => {
                      if (value >= 1_000_000) return "$" + (value / 1_000_000).toFixed(1) + "M";
                      if (value >= 1_000) return "$" + (value / 1_000).toFixed(1) + "K";
                      return "$" + value;
                    }}
                    style={{ fontSize: "12px", fill: "#6b7280" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="total_revenue" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#f59e0b" }}
                    activeDot={{ r: 6 }}
                    fill="url(#colorRevenue)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average Order Value Chart */}
          <div className="chart-container">
            <h4 className="section-title">Average Order Value by Month</h4>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 40 }}>
                <defs>
                  <linearGradient id="colorAvgOrder" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.85}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="sales_month" 
                  tickFormatter={(month) => formatMonthLabel(null, month)}
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
                <Bar 
                  dataKey="avg_order_value" 
                  fill="url(#colorAvgOrder)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
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
                  <th className="table-header-cell-right">Orders</th>
                  <th className="table-header-cell-right">Customers</th>
                  <th className="table-header-cell-right">Revenue</th>
                  <th className="table-header-cell-right">Avg Order Value</th>
                </tr>
              </thead>
              <tbody>
                {data.map((month, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell-bold">{month.month_name}</td>
                    <td className="table-cell-center">{month.sales_year}</td>
                    <td className="table-cell-right">{parseInt(month.total_orders).toLocaleString()}</td>
                    <td className="table-cell-right">{parseInt(month.total_customers).toLocaleString()}</td>
                    <td className="table-cell-green">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(month.total_revenue)}
                    </td>
                    <td className="table-cell-blue">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(month.avg_order_value)}
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