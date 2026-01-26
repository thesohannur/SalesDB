import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import "./DashboardCommon.css";

export default function MonthlyRevenuePerYear() {
  const [revenueData, setRevenueData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch available years
  const fetchYears = async () => {
    try {
      const res = await fetch("/api/monthly-revenue/years");
      const json = await res.json();
      setYears(json);
    } catch (err) {
      console.error("Failed to fetch years:", err);
    }
  };

  // Fetch monthly revenue based on selected year
  const fetchRevenueData = async (year) => {
    try {
      setLoading(true);
      let url = `/api/monthly-revenue`;

      if (year !== "all") {
        url += `?year=${year}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (Array.isArray(json)) {
        setRevenueData(json);
      } else {
        console.error("Expected array but got:", json);
        setRevenueData([]);
      }
    } catch (err) {
      console.error("Failed to fetch revenue data:", err);
      setRevenueData([]);
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
    fetchRevenueData(selectedYear);
  }, [selectedYear]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">
            {data.month_name} {data.year}
          </p>
          <p className="tooltip-item tooltip-primary">
            Revenue:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.total_revenue)}
          </p>
          <p className="tooltip-item tooltip-success">
            Orders: {data.total_orders?.toLocaleString()}
          </p>
          <p className="tooltip-item tooltip-warning">
            Avg Order Value:{" "}
            {new Intl.NumberFormat("en-US", {
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
    if (revenueData.length === 0)
      return {
        totalRevenue: 0,
        totalOrders: 0,
        avgMonthlyRevenue: 0,
        highestMonth: "-",
      };

    const totalRevenue = revenueData.reduce(
      (sum, item) => sum + parseFloat(item.total_revenue || 0),
      0
    );
    const totalOrders = revenueData.reduce(
      (sum, item) => sum + parseInt(item.total_orders || 0),
      0
    );
    const avgMonthlyRevenue =
      revenueData.length > 0 ? totalRevenue / revenueData.length : 0;

    const highestRevenueMonth = revenueData.reduce((max, item) =>
      parseFloat(item.total_revenue) > parseFloat(max.total_revenue || 0)
        ? item
        : max
    );
    const highestMonth = `${highestRevenueMonth.month_name} ${highestRevenueMonth.year}`;

    return { totalRevenue, totalOrders, avgMonthlyRevenue, highestMonth };
  };

  const stats = calculateStats();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Monthly Revenue Dashboard</h2>

      {/* Year Selection Dropdown */}
      <div className="filter-section">
        <label htmlFor="year-select" className="filter-label">
          Select Year:
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Years</option>
          {years.map((y) => (
            <option key={y.year} value={y.year}>
              {y.year}
            </option>
          ))}
        </select>
      </div>

      <h3 className="dashboard-subtitle">
        {selectedYear === "all"
          ? "All Time Performance"
          : `Performance in ${selectedYear}`}
      </h3>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">Loading revenue data...</div>
      ) : revenueData.length === 0 ? (
        <div className="empty-state">
          No data available for the selected year
        </div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card card-green">
              <h4>Total Revenue</h4>
              <p>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(stats.totalRevenue)}
              </p>
            </div>

            <div className="summary-card card-blue">
              <h4>Total Orders</h4>
              <p>{stats.totalOrders.toLocaleString()}</p>
            </div>

            <div className="summary-card card-purple">
              <h4>Avg Monthly Revenue</h4>
              <p>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(stats.avgMonthlyRevenue)}
              </p>
            </div>

            <div className="summary-card card-orange">
              <h4>Highest Month</h4>
              <p style={{ fontSize: "20px" }}>{stats.highestMonth}</p>
            </div>
          </div>

          {/* Revenue Trend Area Chart */}
          <div className="chart-container-elevated">
            <h4 className="section-title">Monthly Revenue Trend</h4>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                data={revenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month_name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <YAxis
                  tickFormatter={(value) => {
                    if (value >= 1_000_000)
                      return "$" + (value / 1_000_000).toFixed(1) + "M";
                    if (value >= 1_000)
                      return "$" + (value / 1_000).toFixed(1) + "K";
                    return "$" + value;
                  }}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="total_revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                  name="Monthly Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Orders Bar Chart */}
          <div className="chart-container">
            <h4 className="chart-title">Monthly Orders</h4>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={revenueData}
                margin={{ top: 5, right: 20, left: 5, bottom: 60 }}
                barSize={40}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="month_name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  stroke="#d1d5db"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <YAxis
                  stroke="#d1d5db"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{ fontWeight: "500" }}
                />
                <Legend
                  wrapperStyle={{ fontWeight: "600", paddingTop: "10px" }}
                />
                <defs>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <Bar
                  dataKey="total_orders"
                  fill="url(#ordersGradient)"
                  name="Total Orders"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue vs Orders Comparison */}
          <div className="chart-container-elevated">
            <h4 className="section-title">Revenue vs Orders Comparison</h4>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={revenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month_name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) => {
                    if (value >= 1_000_000)
                      return "$" + (value / 1_000_000).toFixed(1) + "M";
                    if (value >= 1_000)
                      return "$" + (value / 1_000).toFixed(1) + "K";
                    return "$" + value;
                  }}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="total_revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Revenue"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="total_orders"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div className="table-container">
            <h4 className="chart-title">Detailed Monthly Breakdown</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-left">Month</th>
                  <th className="text-right">Revenue</th>
                  <th className="text-right">Orders</th>
                  <th className="text-right">Quantity Sold</th>
                  <th className="text-right">Avg Order Value</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.map((month, index) => (
                  <tr key={index}>
                    <td className="text-left cell-bold">
                      {month.month_name} {month.year}
                    </td>
                    <td className="text-right cell-primary">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(month.total_revenue)}
                    </td>
                    <td className="text-right">
                      {parseInt(month.total_orders).toLocaleString()}
                    </td>
                    <td className="text-right">
                      {parseInt(month.total_quantity || 0).toLocaleString()}
                    </td>
                    <td className="text-right cell-secondary">
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