import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, TrendingDown, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/DashboardStyles.css";

export default function MonthlyRevenueDropDashboard() {
  const [data, setData] = useState([]);
  const [threshold, setThreshold] = useState(17);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("all");
  const navigate = useNavigate();

  // Severity colors
  const SEVERITY_COLORS = {
    'Critical': '#dc2626',      // Red 600
    'High': '#ef4444',          // Red 500
    'Medium': '#f59e0b',        // Orange 500
    'Low': '#fbbf24',           // Yellow 400
    'None': '#10b981',       // Green 500
    'No Data': '#9ca3af'        // Gray 400
  };

  // Fetch data
  const fetchData = async (thresholdValue) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/revenue-drop/monthly?threshold=${thresholdValue}`);
      
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
      console.error("Failed to fetch monthly drop analysis:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(threshold);
  }, [threshold]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">
            {data.month_name?.trim()} {data.analysis_year}
          </p>
          <p className="tooltip-item-blue">
            Current: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.current_revenue)}
          </p>
          <p className="tooltip-item-orange">
            Previous: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.previous_revenue)}
          </p>
          <p className="tooltip-item" style={{ 
            fontWeight: 'bold',
            color: SEVERITY_COLORS[data.drop_severity]
          }}>
            Change: {data.change_percentage >= 0 ? '+' : ''}{parseFloat(data.change_percentage).toFixed(2)}%
          </p>
          <p className="tooltip-item" style={{
            backgroundColor: SEVERITY_COLORS[data.drop_severity] + '20',
            color: SEVERITY_COLORS[data.drop_severity],
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: '600',
            fontSize: '12px'
          }}>
            {data.drop_severity}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate stats
  const calculateStats = () => {
    if (data.length === 0) return {
      totalMonths: 0,
      criticalMonths: 0,
      highDropMonths: 0,
      growthMonths: 0,
      avgChange: 0,
      worstMonth: null
    };

    const totalMonths = data.length;
    const criticalMonths = data.filter(item => item.drop_severity === 'Critical').length;
    const highDropMonths = data.filter(item => item.drop_severity === 'High').length;
    const growthMonths = data.filter(item => parseFloat(item.change_percentage) > 0).length;
    
    const avgChange = data.reduce((sum, item) => 
      sum + parseFloat(item.change_percentage || 0), 0) / totalMonths;
    
    const worstMonth = data.reduce((worst, item) => 
      parseFloat(item.change_percentage) < parseFloat(worst.change_percentage || Infinity) ? item : worst
    , data[0]);

    return {
      totalMonths,
      criticalMonths,
      highDropMonths,
      growthMonths,
      avgChange,
      worstMonth
    };
  };

  const stats = calculateStats();

  // Get unique years
  const years = [...new Set(data.map(item => item.analysis_year))].sort((a, b) => b - a);

  // Filter data by selected year
  const filteredData = selectedYear === "all" 
    ? data 
    : data.filter(item => item.analysis_year === parseInt(selectedYear));

  // Get severity distribution
  const getSeverityDistribution = () => {
    const distribution = {};
    filteredData.forEach(item => {
      const severity = item.drop_severity;
      distribution[severity] = (distribution[severity] || 0) + 1;
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  };

  const severityDistribution = getSeverityDistribution();

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
    if (percent < 0.014) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text 
        x={x} 
        y={y} 
        fill="#1f2937" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontSize: '13px', fontWeight: '600' }}
      >
        {`${name}: ${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  // Get month abbreviation
  const getMonthAbbr = (monthName) => {
    const months = {
      'January': 'Jan', 'February': 'Feb', 'March': 'Mar', 'April': 'Apr',
      'May': 'May', 'June': 'Jun', 'July': 'Jul', 'August': 'Aug',
      'September': 'Sep', 'October': 'Oct', 'November': 'Nov', 'December': 'Dec'
    };
    return months[monthName?.trim()] || monthName;
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Monthly Revenue Drop Analysis</h2>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>

        {/* Year Filter */}
        <div className="year-selection">
          <label className="year-label">Filter by Year:</label>
          <select
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
      </div>

      <h3 className="performance-heading">
        Month-over-Month Revenue Analysis {selectedYear !== "all" && `- ${selectedYear}`}
      </h3>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">Loading monthly drop analysis...</div>
      ) : data.length === 0 ? (
        <div className="empty-state">No data available</div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card summary-card-purple">
              <h4 className="card-title">Total Months</h4>
              <p className="card-value">{stats.totalMonths}</p>
            </div>
            
            <div className="summary-card summary-card-pink">
              <h4 className="card-title">Critical Drops</h4>
              <p className="card-value" >
                {stats.criticalMonths}
              </p>
            </div>
            
            <div className="summary-card summary-card-blue">
              <h4 className="card-title">High Drops</h4>
              <p className="card-value" >
                {stats.highDropMonths}
              </p>
            </div>

            <div className="summary-card summary-card-orange">
              <h4 className="card-title">Growth Months</h4>
              <p className="card-value">{stats.growthMonths}</p>
            </div>
          </div>

          {/* Worst Month Alert */}
          {stats.worstMonth && parseFloat(stats.worstMonth.change_percentage) < -threshold && (
            <div style={{
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              border: '2px solid #dc2626',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <AlertTriangle size={32} color="#dc2626" />
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#991b1b', marginBottom: '0.5rem' }}>
                  Worst Performing Month: {stats.worstMonth.month_name?.trim()} {stats.worstMonth.analysis_year}
                </h4>
                <p style={{ color: '#7f1d1d', marginBottom: '0.5rem' }}>
                  Revenue dropped by <strong>{parseFloat(stats.worstMonth.change_percentage).toFixed(2)}%</strong> 
                  ({new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(Math.abs(stats.worstMonth.revenue_change))})
                </p>
                <p style={{ color: '#7f1d1d', fontSize: '0.875rem' }}>
                  <strong>Recommendation:</strong> {stats.worstMonth.recommendations}
                </p>
              </div>
            </div>
          )}

          {/* Monthly Change Percentage Trend */}
          <div className="chart-container">
            <h4 className="section-title">Monthly Change Percentage Trend</h4>
            <ResponsiveContainer width="100%" height={450}>
              <ComposedChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <defs>
                  <linearGradient id="colorChange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month_name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tickFormatter={(value, index) => {
                    const item = filteredData[index];
                    return item ? `${getMonthAbbr(value)} ${item.analysis_year}` : '';
                  }}
                  style={{ fontSize: "10px", fill: "#6b7280" }}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  style={{ fontSize: "12px", fill: "#6b7280" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="change_percentage"
                  fill="url(#colorChange)"
                  stroke="#667eea"
                  strokeWidth={3}
                  name="Change %"
                />
                <Line 
                  type="monotone" 
                  dataKey={0} 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Zero Line"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Comparison */}
          <div className="chart-container">
            <h4 className="section-title">Current vs Previous Month Revenue</h4>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="month_name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tickFormatter={(value, index) => {
                    const item = filteredData[index];
                    return item ? `${getMonthAbbr(value)} ${item.analysis_year}` : '';
                  }}
                  style={{ fontSize: "10px", fill: "#6b7280" }}
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
                <Legend />
                <Bar dataKey="current_revenue" fill="#667eea" name="Current Month" radius={[6, 6, 0, 0]} />
                <Bar dataKey="previous_revenue" fill="#9ca3af" name="Previous Month" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Severity Distribution and Order/Customer Metrics */}
          <div className="chart-grid">
            {/* Severity Distribution */}
            <div className="chart-card">
              <h4 className="section-title">Drop Severity Distribution</h4>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={severityDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                    label={renderCustomLabel}
                    labelLine={true}
                  >
                    {severityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Order Volume Change */}
            <div className="chart-card">
              <h4 className="section-title">Monthly Order Volume</h4>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month_name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tickFormatter={(value, index) => {
                      const item = filteredData[index];
                      return item ? `${getMonthAbbr(value)} ${item.analysis_year}` : '';
                    }}
                    style={{ fontSize: "10px", fill: "#6b7280" }}
                  />
                  <YAxis style={{ fontSize: "12px", fill: "#6b7280" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="current_orders" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#10b981" }}
                    name="Current Orders"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previous_orders" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3, fill: "#f59e0b" }}
                    name="Previous Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table */}
          <div className="table-container">
            <h4 className="section-title">Detailed Monthly Breakdown</h4>
            <table className="data-table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Year</th>
                  <th className="table-header-cell">Month</th>
                  <th className="table-header-cell-right">Current Revenue</th>
                  <th className="table-header-cell-right">Previous Revenue</th>
                  <th className="table-header-cell-right">Change</th>
                  <th className="table-header-cell-right">Change %</th>
                  <th className="table-header-cell-center">Severity</th>
                  <th className="table-header-cell">Affected Category</th>
                  <th className="table-header-cell-right">Cat. Drop %</th>
                  <th className="table-header-cell">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell-bold">{item.analysis_year}</td>
                    <td className="table-cell">{item.month_name?.trim()}</td>
                    <td className="table-cell-blue">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.current_revenue)}
                    </td>
                    <td className="table-cell-right">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.previous_revenue)}
                    </td>
                    <td className="table-cell-right" style={{
                      color: item.revenue_change >= 0 ? '#10b981' : '#ef4444',
                      fontWeight: 'bold'
                    }}>
                      {item.revenue_change >= 0 ? '+' : ''}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.revenue_change)}
                    </td>
                    <td className="table-cell-right" style={{
                      color: SEVERITY_COLORS[item.drop_severity],
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }}>
                      {item.change_percentage >= 0 ? '+' : ''}{parseFloat(item.change_percentage).toFixed(2)}%
                    </td>
                    <td className="table-cell-center">
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        backgroundColor: SEVERITY_COLORS[item.drop_severity] + '20',
                        color: SEVERITY_COLORS[item.drop_severity]
                      }}>
                        {item.drop_severity}
                      </span>
                    </td>
                    <td className="table-cell">{item.affected_category}</td>
                    <td className="table-cell-right" style={{
                      color: item.category_drop_percentage >= 0 ? '#10b981' : '#ef4444'
                    }}>
                      {parseFloat(item.category_drop_percentage).toFixed(2)}%
                    </td>
                    <td className="table-cell" style={{ 
                      maxWidth: '300px',
                      fontSize: '0.875rem',
                      color: '#4b5563'
                    }}>
                      {item.recommendations}
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
