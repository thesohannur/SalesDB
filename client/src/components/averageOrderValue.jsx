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

export default function AverageOrderValue() {
  const [aovData, setAovData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch available years
  const fetchYears = async () => {
    try {
      const res = await fetch("/api/average-order-value/years");
      const json = await res.json();
      setYears(json);
    } catch (err) {
      console.error("Failed to fetch years:", err);
    }
  };

  // Fetch AOV data
  const fetchAovData = async (year) => {
    try {
      setLoading(true);
      let url = `/api/average-order-value`;

      if (year !== "all") {
        url += `/by-year?year=${year}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (Array.isArray(json)) {
        setAovData(json);
      } else {
        setAovData([]);
      }
    } catch (err) {
      console.error("Failed to fetch AOV data:", err);
      setAovData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    fetchAovData(selectedYear);
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
            Avg Order Value: ৳{parseFloat(data.avg_order_value).toFixed(2)}
          </p>
          <p className="tooltip-item tooltip-primary">
            Total Revenue: ৳{parseFloat(data.total_revenue).toLocaleString()}
          </p>
          <p className="tooltip-item tooltip-warning">
            Orders: {parseInt(data.total_orders).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Summary calculations
  const calculateStats = () => {
    if (aovData.length === 0)
      return {
        avgAOV: 0,
        highestAOV: 0,
        lowestAOV: 0,
        bestMonth: "-",
      };

    const values = aovData.map((d) => parseFloat(d.avg_order_value));
    const avgAOV =
      values.reduce((sum, v) => sum + v, 0) / values.length;

    const maxItem = aovData.reduce((max, item) =>
      parseFloat(item.avg_order_value) >
      parseFloat(max.avg_order_value)
        ? item
        : max
    );

    return {
      avgAOV,
      highestAOV: Math.max(...values),
      lowestAOV: Math.min(...values),
      bestMonth: `${maxItem.month_name} ${maxItem.year}`,
    };
  };

  const stats = calculateStats();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Average Order Value Dashboard</h2>

      {/* Year Filter */}
      <div className="filter-section">
        <label className="filter-label">Select Year:</label>
        <select
          className="filter-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
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
        {selectedYear === "all"
          ? "All Time Performance"
          : `Performance in ${selectedYear}`}
      </h3>

      {loading ? (
        <div className="loading-state">Loading AOV data...</div>
      ) : aovData.length === 0 ? (
        <div className="empty-state">No data available</div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card card-green">
              <h4>Average AOV</h4>
              <p>৳{stats.avgAOV.toFixed(2)}</p>
            </div>

            <div className="summary-card card-blue">
              <h4>Highest AOV</h4>
              <p>৳{stats.highestAOV.toFixed(2)}</p>
            </div>

            <div className="summary-card card-yellow">
              <h4>Lowest AOV</h4>
              <p>৳{stats.lowestAOV.toFixed(2)}</p>
            </div>

            <div className="summary-card card-purple">
              <h4>Best Month</h4>
              <p style={{ fontSize: "20px" }}>{stats.bestMonth}</p>
            </div>
          </div>

          {/* AOV Trend */}
          <div className="chart-container-elevated">
            <h4 className="section-title">Monthly AOV Trend</h4>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={aovData}>
                <defs>
                  <linearGradient id="aovGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month_name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="avg_order_value"
                  stroke="#3b82f6"
                  fill="url(#aovGradient)"
                  name="Average Order Value"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue vs Orders */}
          <div className="chart-container">
            <h4 className="chart-title">Revenue vs Orders</h4>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={aovData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month_name" angle={-45} textAnchor="end" height={70} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="left"
                  dataKey="total_revenue"
                  stroke="#10b981"
                  name="Revenue"
                />
                <Line
                  yAxisId="right"
                  dataKey="total_orders"
                  stroke="#f59e0b"
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div className="table-container">
            <h4 className="chart-title">Monthly AOV Breakdown</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th className="text-right">Revenue</th>
                  <th className="text-right">Orders</th>
                  <th className="text-right">AOV</th>
                </tr>
              </thead>
              <tbody>
                {aovData.map((row, i) => (
                  <tr key={i}>
                    <td className="cell-bold">
                      {row.month_name} {row.year}
                    </td>
                    <td className="text-right cell-success">
                      ৳{parseFloat(row.total_revenue).toLocaleString()}
                    </td>
                    <td className="text-right">
                      {parseInt(row.total_orders).toLocaleString()}
                    </td>
                    <td className="text-right cell-primary">
                      ৳{parseFloat(row.avg_order_value).toFixed(2)}
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
