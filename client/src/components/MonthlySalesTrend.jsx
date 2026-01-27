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

export default function MonthlySalesTrend() {
  const [revenueData, setRevenueData] = useState([]);
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

  // Fetch monthly revenue data
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

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    fetchRevenueData(selectedYear);
  }, [selectedYear]);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">
            {data.month_name} {data.year}
          </p>
          <p className="tooltip-item tooltip-success">
            Revenue: ৳{parseFloat(data.total_revenue || 0).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Summary stats
  const calculateStats = () => {
    if (revenueData.length === 0) {
      return {
        totalRevenue: 0,
        avgMonthlyRevenue: 0,
        highestMonth: "-",
      };
    }

    const totalRevenue = revenueData.reduce(
      (sum, item) => sum + parseFloat(item.total_revenue || 0),
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

    return { totalRevenue, avgMonthlyRevenue, highestMonth };
  };

  const stats = calculateStats();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Monthly Sales Trend Dashboard</h2>

      {/* Year Filter */}
      <div className="filter-section">
        <label className="filter-label">Select Year:</label>
        <select
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
          ? "All Time Revenue Performance"
          : `Revenue Performance in ${selectedYear}`}
      </h3>

      {/* States */}
      {loading ? (
        <div className="loading-state">Loading revenue data...</div>
      ) : revenueData.length === 0 ? (
        <div className="empty-state">No data available</div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card card-green">
              <h4>Total Revenue</h4>
              <p>৳{stats.totalRevenue.toLocaleString()}</p>
            </div>

            <div className="summary-card card-blue">
              <h4>Avg Monthly Revenue</h4>
              <p>৳{Math.round(stats.avgMonthlyRevenue).toLocaleString()}</p>
            </div>

            <div className="summary-card card-orange">
              <h4>Peak Month</h4>
              <p style={{ fontSize: "20px" }}>{stats.highestMonth}</p>
            </div>
          </div>

          {/* Revenue Trend */}
          <div className="chart-container-elevated">
            <h4 className="section-title">Monthly Revenue Trend</h4>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
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
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="total_revenue"
                  stroke="#3b82f6"
                  fill="url(#revenueGradient)"
                  name="Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Bar Chart */}
          <div className="chart-container">
            <h4 className="chart-title">Monthly Revenue Comparison</h4>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month_name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="total_revenue"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  name="Revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div className="table-container">
            <h4 className="chart-title">Monthly Revenue Breakdown</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-left">Month</th>
                  <th className="text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="text-left cell-bold">
                      {row.month_name} {row.year}
                    </td>
                    <td className="text-right cell-primary">
                      ৳{parseFloat(row.total_revenue).toLocaleString()}
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
