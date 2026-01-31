import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, TrendingDown, TrendingUp, Calendar, Filter } from "lucide-react";
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

export default function WeeklyRevenueDropDashboard() {
  const [data, setData] = useState([]);
  const [threshold, setThreshold] = useState(20);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const navigate = useNavigate();

  // Severity colors
  const SEVERITY_COLORS = {
    'Critical': '#dc2626',
    'High': '#ef4444',
    'Medium': '#f59e0b',
    'Low': '#fbbf24',
    'No Drop': '#10b981',
    'No Data': '#9ca3af'
  };

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fetch data
  const fetchData = async (thresholdValue) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/revenue-drop/weekly?threshold=${thresholdValue}`);
      
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
      console.error("Failed to fetch weekly drop analysis:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(threshold);
  }, [threshold]);

  // Get unique years and months
  const years = [...new Set(data.map(item => item.analysis_year))].sort((a, b) => b - a);
  const months = selectedYear === "all" 
    ? []
    : [...new Set(data
        .filter(item => item.analysis_year === parseInt(selectedYear))
        .map(item => item.analysis_month))]
      .sort((a, b) => a - b);

  // Filter data
  const filteredData = data.filter(item => {
    if (selectedYear !== "all" && item.analysis_year !== parseInt(selectedYear)) {
      return false;
    }
    if (selectedMonth !== "all" && item.analysis_month !== parseInt(selectedMonth)) {
      return false;
    }
    return true;
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">
            Week {data.week_of_month} of {data.month_name?.trim()} {data.analysis_year}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            {new Date(data.current_period_start).toLocaleDateString()} - {new Date(data.current_period_end).toLocaleDateString()}
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
          <p className="tooltip-item-green">
            Orders: {data.current_orders} vs {data.previous_orders}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate stats
  const calculateStats = () => {
    if (filteredData.length === 0) return {
      totalWeeks: 0,
      criticalWeeks: 0,
      highDropWeeks: 0,
      growthWeeks: 0,
      avgChange: 0,
      worstWeek: null
    };

    const totalWeeks = filteredData.length;
    const criticalWeeks = filteredData.filter(item => item.drop_severity === 'Critical').length;
    const highDropWeeks = filteredData.filter(item => item.drop_severity === 'High').length;
    const growthWeeks = filteredData.filter(item => parseFloat(item.change_percentage) > 0).length;
    
    const avgChange = filteredData.reduce((sum, item) => 
      sum + parseFloat(item.change_percentage || 0), 0) / totalWeeks;
    
    const worstWeek = filteredData.reduce((worst, item) => 
      parseFloat(item.change_percentage) < parseFloat(worst.change_percentage || Infinity) ? item : worst
    , filteredData[0]);

    return {
      totalWeeks,
      criticalWeeks,
      highDropWeeks,
      growthWeeks,
      avgChange,
      worstWeek
    };
  };

  const stats = calculateStats();

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

  // Create week label for charts
  const createWeekLabel = (item) => {
    return `W${item.week_of_month} ${MONTH_NAMES[item.analysis_month - 1]?.slice(0, 3)} ${item.analysis_year}`;
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Weekly Revenue Drop Analysis</h2>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {/* Threshold Selector */}
        <div className="year-selection">
          <label className="year-label">Drop Threshold %:</label>
          <select
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="year-select"
          >
            <option value={10}>10%</option>
            <option value={15}>15%</option>
            <option value={20}>20%</option>
            <option value={25}>25%</option>
            <option value={30}>30%</option>
          </select>
        </div>

        {/* Year Filter */}
        <div className="year-selection">
          <label className="year-label">Filter by Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setSelectedMonth("all"); // Reset month when year changes
            }}
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

        {/* Month Filter */}
        {selectedYear !== "all" && (
          <div className="year-selection">
            <label className="year-label">Filter by Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="year-select"
            >
              <option value="all">All Months</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {MONTH_NAMES[m - 1]}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <h3 className="performance-heading">
        Week-over-Week Revenue Analysis
        {selectedYear !== "all" && ` - ${selectedYear}`}
        {selectedMonth !== "all" && ` ${MONTH_NAMES[parseInt(selectedMonth) - 1]}`}
      </h3>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">Loading weekly drop analysis...</div>
      ) : data.length === 0 ? (
        <div className="empty-state">No data available</div>
      ) : filteredData.length === 0 ? (
        <div className="empty-state">No data for selected filters</div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card summary-card-purple">
              <h4 className="card-title">Total Weeks</h4>
              <p className="card-value">{stats.totalWeeks}</p>
            </div>
            
            <div className="summary-card summary-card-pink">
              <h4 className="card-title">Critical Weeks</h4>
              <p className="card-value" style={{ color: '#dc2626' }}>
                {stats.criticalWeeks}
              </p>
            </div>
            
            <div className="summary-card summary-card-blue">
              <h4 className="card-title">High Drop Weeks</h4>
              <p className="card-value" style={{ color: '#ef4444' }}>
                {stats.highDropWeeks}
              </p>
            </div>

            <div className="summary-card summary-card-green">
              <h4 className="card-title">Growth Weeks</h4>
              <p className="card-value">{stats.growthWeeks}</p>
            </div>
          </div>

          {/* Worst Week Alert */}
          {stats.worstWeek && parseFloat(stats.worstWeek.change_percentage) < -threshold && (
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
                  Worst Week: Week {stats.worstWeek.week_of_month} of {stats.worstWeek.month_name?.trim()} {stats.worstWeek.analysis_year}
                </h4>
                <p style={{ color: '#7f1d1d', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  {new Date(stats.worstWeek.current_period_start).toLocaleDateString()} - {new Date(stats.worstWeek.current_period_end).toLocaleDateString()}
                </p>
                <p style={{ color: '#7f1d1d', marginBottom: '0.5rem' }}>
                  Revenue dropped by <strong>{parseFloat(stats.worstWeek.change_percentage).toFixed(2)}%</strong>
                </p>
                <p style={{ color: '#7f1d1d', fontSize: '0.875rem' }}>
                  <strong>Action:</strong> {stats.worstWeek.recommendations}
                </p>
              </div>
            </div>
          )}

          {/* Weekly Change Trend */}
          <div className="chart-container">
            <h4 className="section-title">Weekly Revenue Change %</h4>
            <ResponsiveContainer width="100%" height={450}>
              <ComposedChart data={filteredData.slice(-20)} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="week_of_month"
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  tickFormatter={(value, index) => {
                    const item = filteredData.slice(-20)[index];
                    return item ? createWeekLabel(item) : '';
                  }}
                  style={{ fontSize: "9px", fill: "#6b7280" }}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  style={{ fontSize: "12px", fill: "#6b7280" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="change_percentage" name="Change %" radius={[6, 6, 0, 0]}>
                  {filteredData.slice(-20).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={SEVERITY_COLORS[entry.drop_severity]}
                    />
                  ))}
                </Bar>
                <Line 
                  type="monotone" 
                  dataKey={0} 
                  stroke="#9ca3af" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Zero Line"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Revenue Comparison */}
          <div className="chart-container">
            <h4 className="section-title">Current vs Previous Week Revenue (Last 15 weeks)</h4>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={filteredData.slice(-15)} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="week_of_month"
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  tickFormatter={(value, index) => {
                    const item = filteredData.slice(-15)[index];
                    return item ? createWeekLabel(item) : '';
                  }}
                  style={{ fontSize: "9px", fill: "#6b7280" }}
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
                <Bar dataKey="current_revenue" fill="#667eea" name="Current Week" radius={[6, 6, 0, 0]} />
                <Bar dataKey="previous_revenue" fill="#9ca3af" name="Previous Week" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Charts Grid */}
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

            {/* Weekly Orders Trend */}
            <div className="chart-card">
              <h4 className="section-title">Weekly Order Volume (Last 15)</h4>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={filteredData.slice(-15)} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="week_of_month"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    tickFormatter={(value, index) => {
                      const item = filteredData.slice(-15)[index];
                      return item ? createWeekLabel(item) : '';
                    }}
                    style={{ fontSize: "9px", fill: "#6b7280" }}
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
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table */}
          <div className="table-container">
            <h4 className="section-title">Detailed Weekly Breakdown</h4>
            <table className="data-table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Year</th>
                  <th className="table-header-cell">Month</th>
                  <th className="table-header-cell">Week</th>
                  <th className="table-header-cell">Period</th>
                  <th className="table-header-cell-right">Current Rev</th>
                  <th className="table-header-cell-right">Prev Rev</th>
                  <th className="table-header-cell-right">Change %</th>
                  <th className="table-header-cell-center">Severity</th>
                  <th className="table-header-cell">Affected Cat</th>
                  <th className="table-header-cell">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell">{item.analysis_year}</td>
                    <td className="table-cell">{item.month_name?.trim()}</td>
                    <td className="table-cell-bold">Week {item.week_of_month}</td>
                    <td className="table-cell" style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {new Date(item.current_period_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(item.current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="table-cell-blue">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        notation: "compact"
                      }).format(item.current_revenue)}
                    </td>
                    <td className="table-cell-right">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        notation: "compact"
                      }).format(item.previous_revenue)}
                    </td>
                    <td className="table-cell-right" style={{
                      color: SEVERITY_COLORS[item.drop_severity],
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}>
                      {item.change_percentage >= 0 ? '+' : ''}{parseFloat(item.change_percentage).toFixed(2)}%
                    </td>
                    <td className="table-cell-center">
                      <span style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "600",
                        backgroundColor: SEVERITY_COLORS[item.drop_severity] + '20',
                        color: SEVERITY_COLORS[item.drop_severity]
                      }}>
                        {item.drop_severity}
                      </span>
                    </td>
                    <td className="table-cell" style={{ fontSize: '0.875rem' }}>
                      {item.affected_category}
                    </td>
                    <td className="table-cell" style={{ 
                      maxWidth: '250px',
                      fontSize: '0.75rem',
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
