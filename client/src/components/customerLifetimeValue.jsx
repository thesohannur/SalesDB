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

export default function CustomerLifetimeValue() {
  const [clvData, setClvData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH AVAILABLE YEARS
     ========================= */
  const fetchYears = async () => {
    try {
      const res = await fetch("/api/customer-lifetime-value/years");
      const json = await res.json();
      setYears(json);
    } catch (err) {
      console.error("Failed to fetch years:", err);
    }
  };

  /* =========================
     FETCH CLV DATA
     ========================= */
  const fetchCLVData = async (year) => {
    try {
      setLoading(true);
      let url = `/api/customer-lifetime-value`;

      if (year !== "all") {
        url += `?year=${year}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (Array.isArray(json)) {
        setClvData(json);
      } else {
        setClvData([]);
      }
    } catch (err) {
      console.error("Failed to fetch CLV data:", err);
      setClvData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    fetchCLVData(selectedYear);
  }, [selectedYear]);

  /* =========================
     CUSTOM TOOLTIP
     ========================= */
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{data.customer_name}</p>
          <p className="tooltip-item tooltip-primary">
            Lifetime Revenue: ৳{parseFloat(data.lifetime_value).toLocaleString()}
          </p>
          <p className="tooltip-item tooltip-success">
            Orders: {data.total_orders}
          </p>
          <p className="tooltip-item tooltip-warning">
            Avg Order Value: ৳{parseFloat(data.avg_order_value).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  /* =========================
     SUMMARY STATS
     ========================= */
  const calculateStats = () => {
    if (clvData.length === 0) {
      return {
        totalRevenue: 0,
        avgCLV: 0,
        topCustomer: "-",
      };
    }

    const totalRevenue = clvData.reduce(
      (sum, c) => sum + parseFloat(c.lifetime_value || 0),
      0
    );

    const avgCLV = totalRevenue / clvData.length;

    const topCustomer = clvData.reduce((max, c) =>
      parseFloat(c.lifetime_value) > parseFloat(max.lifetime_value || 0)
        ? c
        : max
    );

    return {
      totalRevenue,
      avgCLV,
      topCustomer: topCustomer.customer_name,
    };
  };

  const stats = calculateStats();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Customer Lifetime Value Dashboard</h2>

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
          ? "All Time Customer Value"
          : `Customer Value in ${selectedYear}`}
      </h3>

      {/* STATES */}
      {loading ? (
        <div className="loading-state">Loading customer data...</div>
      ) : clvData.length === 0 ? (
        <div className="empty-state">No data available</div>
      ) : (
        <div>
          {/* =========================
              SUMMARY CARDS
             ========================= */}
          <div className="summary-cards">
            <div className="summary-card card-green">
              <h4>Total Lifetime Revenue</h4>
              <p>৳{stats.totalRevenue.toLocaleString()}</p>
            </div>

            <div className="summary-card card-blue">
              <h4>Average CLV</h4>
              <p>৳{stats.avgCLV.toFixed(0)}</p>
            </div>

            <div className="summary-card card-purple">
              <h4>Top Customer</h4>
              <p style={{ fontSize: "18px" }}>{stats.topCustomer}</p>
            </div>
          </div>

          {/* =========================
              CLV AREA CHART
             ========================= */}
          <div className="chart-container-elevated">
            <h4 className="section-title">Customer Lifetime Value Trend</h4>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={clvData}>
                <defs>
                  <linearGradient id="clvGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="customer_name" hide />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="lifetime_value"
                  stroke="#6366f1"
                  fill="url(#clvGradient)"
                  name="CLV"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* =========================
              BAR CHART
             ========================= */}
          <div className="chart-container">
            <h4 className="chart-title">Top Customers by Lifetime Value</h4>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={clvData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="customer_name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="lifetime_value"
                  fill="#10b981"
                  name="Lifetime Value"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* =========================
              DATA TABLE
             ========================= */}
          <div className="table-container">
            <h4 className="chart-title">Customer Lifetime Value Details</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-left">Customer</th>
                  <th className="text-right">Orders</th>
                  <th className="text-right">Lifetime Value</th>
                  <th className="text-right">Avg Order Value</th>
                </tr>
              </thead>
              <tbody>
                {clvData.map((c, i) => (
                  <tr key={i}>
                    <td className="text-left cell-bold">{c.customer_name}</td>
                    <td className="text-right">{c.total_orders}</td>
                    <td className="text-right cell-primary">
                      ৳{parseFloat(c.lifetime_value).toLocaleString()}
                    </td>
                    <td className="text-right cell-warning">
                      ৳{parseFloat(c.avg_order_value).toFixed(2)}
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
