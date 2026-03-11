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

export default function MonthlyOrderCount() {
  const [orderData, setOrderData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch available years
  const fetchYears = async () => {
    try {
      const res = await fetch("/api/daily-sales/years");
      const json = await res.json();
      setYears(json);
    } catch (err) {
      console.error("Failed to fetch years:", err);
    }
  };

  // Fetch monthly order count based on selected year
  const fetchOrderData = async (year) => {
    try {
      setLoading(true);
      let url = `/api/monthly-order-count`;

      if (year !== "all") {
        url += `?year=${year}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (Array.isArray(json)) {
        setOrderData(json);
      } else {
        console.error("Expected array but got:", json);
        setOrderData([]);
      }
    } catch (err) {
      console.error("Failed to fetch order data:", err);
      setOrderData([]);
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
    fetchOrderData(selectedYear);
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
            Orders: {data.total_orders?.toLocaleString()}
          </p>
          <p className="tooltip-item tooltip-success">
            Customers: {data.total_customers?.toLocaleString()}
          </p>
          <p className="tooltip-item tooltip-warning">
            Items Sold: {data.total_items?.toLocaleString()}
          </p>
          <p className="tooltip-item tooltip-info">
            Avg Items/Order: {parseFloat(data.avg_items_per_order || 0).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate summary statistics
  const calculateStats = () => {
    if (orderData.length === 0)
      return {
        totalOrders: 0,
        totalCustomers: 0,
        avgMonthlyOrders: 0,
        highestMonth: "-",
      };

    const totalOrders = orderData.reduce(
      (sum, item) => sum + parseInt(item.total_orders || 0),
      0
    );
    const totalCustomers = orderData.reduce(
      (sum, item) => sum + parseInt(item.total_customers || 0),
      0
    );
    const avgMonthlyOrders =
      orderData.length > 0 ? totalOrders / orderData.length : 0;

    const highestOrderMonth = orderData.reduce((max, item) =>
      parseInt(item.total_orders) > parseInt(max.total_orders || 0)
        ? item
        : max
    );
    const highestMonth = `${highestOrderMonth.month_name} ${highestOrderMonth.year}`;

    return { totalOrders, totalCustomers, avgMonthlyOrders, highestMonth };
  };

  const stats = calculateStats();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Monthly Order Count Dashboard</h2>

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
        <div className="loading-state">Loading order data...</div>
      ) : orderData.length === 0 ? (
        <div className="empty-state">
          No data available for the selected year
        </div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card card-blue">
              <h4>Total Orders</h4>
              <p>{stats.totalOrders.toLocaleString()}</p>
            </div>

            <div className="summary-card card-purple">
              <h4>Unique Customers</h4>
              <p>{stats.totalCustomers.toLocaleString()}</p>
            </div>

            <div className="summary-card card-green">
              <h4>Avg Monthly Orders</h4>
              <p>{Math.round(stats.avgMonthlyOrders).toLocaleString()}</p>
            </div>

            <div className="summary-card card-orange">
              <h4>Peak Month</h4>
              <p style={{ fontSize: "20px" }}>{stats.highestMonth}</p>
            </div>
          </div>

          {/* Order Count Trend Area Chart */}
          <div className="chart-container-elevated">
            <h4 className="section-title">Monthly Order Count Trend</h4>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                data={orderData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
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
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="total_orders"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorOrders)"
                  name="Monthly Orders"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Customers Bar Chart */}
          <div className="chart-container">
            <h4 className="chart-title">Monthly Unique Customers</h4>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={orderData}
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
                  <linearGradient id="customersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <Bar
                  dataKey="total_customers"
                  fill="url(#customersGradient)"
                  name="Unique Customers"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Orders vs Customers Comparison */}
          <div className="chart-container-elevated">
            <h4 className="section-title">Orders vs Customers Comparison</h4>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={orderData}
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
                  dataKey="total_orders"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Total Orders"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="total_customers"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Unique Customers"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Items Sold Bar Chart */}
          <div className="chart-container">
            <h4 className="chart-title">Monthly Items Sold</h4>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={orderData}
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
                  <linearGradient id="itemsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <Bar
                  dataKey="total_items"
                  fill="url(#itemsGradient)"
                  name="Total Items Sold"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div className="table-container">
            <h4 className="chart-title">Detailed Monthly Breakdown</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-left">Month</th>
                  <th className="text-right">Total Orders</th>
                  <th className="text-right">Unique Customers</th>
                  <th className="text-right">Items Sold</th>
                  <th className="text-right">Avg Items/Order</th>
                </tr>
              </thead>
              <tbody>
                {orderData.map((month, index) => (
                  <tr key={index}>
                    <td className="text-left cell-bold">
                      {month.month_name} {month.year}
                    </td>
                    <td className="text-right cell-primary">
                      {parseInt(month.total_orders).toLocaleString()}
                    </td>
                    <td className="text-right cell-secondary">
                      {parseInt(month.total_customers).toLocaleString()}
                    </td>
                    <td className="text-right">
                      {parseInt(month.total_items || 0).toLocaleString()}
                    </td>
                    <td className="text-right cell-warning">
                      {parseFloat(month.avg_items_per_order || 0).toFixed(2)}
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