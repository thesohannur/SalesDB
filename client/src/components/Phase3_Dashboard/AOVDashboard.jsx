import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/DashboardStyles.css";

export default function AverageOrderValueDashboard() {
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

  // Fetch AOV data
  const fetchAverageOrderValue = async (year) => {
    try {
      setLoading(true);
      let url = `/api/average-order-value`;
      
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
      console.error("Failed to fetch AOV data:", err);
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
    fetchAverageOrderValue(selectedYear);
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
            Avg Order: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.avg_order_value)}
          </p>
          <p className="tooltip-item-green">
            Median: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.median_order_value)}
          </p>
          <p className="tooltip-item-orange">
            Orders: <strong>{data.total_orders?.toLocaleString()}</strong>
          </p>
          <p className="tooltip-item">
            Min: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.min_order_value)}
          </p>
          <p className="tooltip-item">
            Max: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.max_order_value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate summary statistics
  const calculateStats = () => {
    if (data.length === 0) return { 
      overallAvgAOV: 0,
      totalRevenue: 0, 
      totalOrders: 0,
      highestAOV: 0,
      lowestAOV: 0,
      bestMonth: "-",
      medianAOV: 0
    };
    
    const totalRevenue = data.reduce((sum, item) => sum + parseFloat(item.total_revenue || 0), 0);
    const totalOrders = data.reduce((sum, item) => sum + parseInt(item.total_orders || 0), 0);
    const overallAvgAOV = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Find highest and lowest AOV
    const highestAOVData = data.reduce((max, item) => 
      parseFloat(item.avg_order_value) > parseFloat(max.avg_order_value || 0) ? item : max
    , { avg_order_value: 0 });
    
    const lowestAOVData = data.reduce((min, item) => 
      parseFloat(item.avg_order_value) < parseFloat(min.avg_order_value || Infinity) ? item : min
    , { avg_order_value: Infinity });
    
    const highestAOV = parseFloat(highestAOVData.avg_order_value || 0);
    const lowestAOV = parseFloat(lowestAOVData.avg_order_value === Infinity ? 0 : lowestAOVData.avg_order_value || 0);
    
    const bestMonth = highestAOVData.month_name 
      ? `${highestAOVData.month_name.trim()} ${highestAOVData.sales_year}` 
      : "-";
    
    // Calculate overall median
    const allMedians = data.map(item => parseFloat(item.median_order_value || 0));
    const medianAOV = allMedians.length > 0 
      ? allMedians.reduce((sum, val) => sum + val, 0) / allMedians.length 
      : 0;
    
    return { 
      overallAvgAOV,
      totalRevenue, 
      totalOrders,
      highestAOV,
      lowestAOV,
      bestMonth,
      medianAOV
    };
  };

  const stats = calculateStats();

  // Format month name for display
  const formatMonthLabel = (monthName, monthNumber) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNumber - 1] || monthName;
  };

  // Create display label for X-axis
  const createMonthLabel = (item) => {
    const monthShort = formatMonthLabel(null, item.sales_month);
    return selectedYear === "all" ? `${monthShort} ${item.sales_year}` : monthShort;
  };

  return (
    <div className="dashboard-container">

     

      <h2 className="dashboard-title">Average Order Value (AOV) Dashboard</h2>

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
        <div className="loading-state">Loading AOV data...</div>
      ) : data.length === 0 ? (
        <div className="empty-state">No data available for the selected year</div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card summary-card-purple">
              <h4 className="card-title">Overall Avg AOV</h4>
              <p className="card-value">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(stats.overallAvgAOV)}
              </p>
            </div>
            
            <div className="summary-card summary-card-pink">
              <h4 className="card-title">Highest AOV</h4>
              <p className="card-value">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(stats.highestAOV)}
              </p>
            </div>
            
            <div className="summary-card summary-card-blue">
              <h4 className="card-title">Median AOV</h4>
              <p className="card-value">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(stats.medianAOV)}
              </p>
            </div>

            <div className="summary-card summary-card-orange">
              <h4 className="card-title">Best Month</h4>
              <p className="card-value-small">{stats.bestMonth}</p>
            </div>
          </div>

          {/* AOV Trend Line Chart */}
          <div className="chart-container">
            <h4 className="section-title">Average Order Value Trend</h4>
            <ResponsiveContainer width="100%" height={450}>
              <ComposedChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 60 }}>
                <defs>
                  <linearGradient id="colorAOV" x1="0" y1="0" x2="0" y2="1">
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
                  tickFormatter={(value) => {
                    if (value >= 1_000) return "$" + (value / 1_000).toFixed(1) + "K";
                    return "$" + value;
                  }}
                  style={{ fontSize: "12px", fill: "#666" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="avg_order_value"
                  fill="url(#colorAOV)"
                  stroke="#667eea"
                  strokeWidth={3}
                  name="Avg Order Value"
                />
                <Line
                  type="monotone"
                  dataKey="median_order_value"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#10b981" }}
                  name="Median"
                  strokeDasharray="5 5"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Min/Max Order Value Chart */}
          <div className="chart-container">
            <h4 className="section-title">Order Value Range (Min - Max)</h4>
            <ResponsiveContainer width="100%" height={400}>
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
                  tickFormatter={(value) => {
                    if (value >= 1_000) return "$" + (value / 1_000).toFixed(1) + "K";
                    return "$" + value;
                  }}
                  style={{ fontSize: "12px", fill: "#6b7280" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="min_order_value" 
                  fill="#ef4444"
                  radius={[6, 6, 0, 0]}
                  name="Min Order Value"
                />
                <Bar 
                  dataKey="max_order_value" 
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  name="Max Order Value"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Orders and Revenue Charts */}
          <div className="chart-grid">
            {/* Monthly Orders */}
            <div className="chart-card">
              <h4 className="section-title">Monthly Orders</h4>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="total_orders" 
                    fill="url(#colorOrders)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Revenue */}
            <div className="chart-card">
              <h4 className="section-title">Monthly Revenue</h4>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 60 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#8b5cf6" }}
                    activeDot={{ r: 6 }}
                    fill="url(#colorRevenue)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AOV Distribution Comparison */}
          <div className="chart-container">
            <h4 className="section-title">AOV Components (Avg vs Median)</h4>
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
                  tickFormatter={(value) => {
                    if (value >= 1_000) return "$" + (value / 1_000).toFixed(1) + "K";
                    return "$" + value;
                  }}
                  style={{ fontSize: "12px", fill: "#6b7280" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="avg_order_value" 
                  fill="#667eea"
                  radius={[6, 6, 0, 0]}
                  name="Average AOV"
                />
                <Bar 
                  dataKey="median_order_value" 
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  name="Median AOV"
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
                  <th className="table-header-cell-right">Avg AOV</th>
                  <th className="table-header-cell-right">Median AOV</th>
                  <th className="table-header-cell-right">Min Order</th>
                  <th className="table-header-cell-right">Max Order</th>
                  <th className="table-header-cell-right">Orders</th>
                  <th className="table-header-cell-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.map((month, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell-bold">{month.month_name}</td>
                    <td className="table-cell-center">{month.sales_year}</td>
                    <td className="table-cell-blue">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(month.avg_order_value)}
                    </td>
                    <td className="table-cell-green">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(month.median_order_value)}
                    </td>
                    <td className="table-cell-right">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(month.min_order_value)}
                    </td>
                    <td className="table-cell-right">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(month.max_order_value)}
                    </td>
                    <td className="table-cell-right">{parseInt(month.total_orders).toLocaleString()}</td>
                    <td className="table-cell-green">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(month.total_revenue)}
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