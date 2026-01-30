import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingDown, TrendingUp, Minus } from "lucide-react";
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

export default function RevenueDecreaseRatioDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Color coding for change types
  const CHANGE_COLORS = {
    'Increase': '#10b981',   // Green
    'Decrease': '#ef4444',   // Red
    'No Change': '#6b7280'   // Gray
  };

  // Fetch Revenue Decrease Ratio data
  const fetchRevenueDecreaseRatio = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/yoy/revenue-decrease-ratio');
      
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
      console.error("Failed to fetch revenue decrease ratio:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueDecreaseRatio();
  }, []);

  // Get icon based on change type
  const getChangeIcon = (changeType) => {
    if (changeType === 'Increase') return <TrendingUp size={20} />;
    if (changeType === 'Decrease') return <TrendingDown size={20} />;
    return <Minus size={20} />;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">
            {data.current_year} vs {data.previous_year}
          </p>
          <p className="tooltip-item-blue">
            {data.current_year} Revenue: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.current_year_revenue)}
          </p>
          <p className="tooltip-item-orange">
            {data.previous_year} Revenue: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.previous_year_revenue)}
          </p>
          <p className="tooltip-item" style={{ 
            fontWeight: 'bold',
            color: CHANGE_COLORS[data.change_type]
          }}>
            Change: {data.change_percentage >= 0 ? '+' : ''}{parseFloat(data.change_percentage).toFixed(2)}%
          </p>
          <p className="tooltip-item-green">
            {data.current_year} Orders: <strong>{data.current_year_orders?.toLocaleString()}</strong>
          </p>
          <p className="tooltip-item">
            {data.previous_year} Orders: <strong>{data.previous_year_orders?.toLocaleString()}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate summary statistics
  const calculateStats = () => {
    if (data.length === 0) return {
      totalYears: 0,
      growthYears: 0,
      declineYears: 0,
      avgGrowthRate: 0,
      bestYear: null,
      worstYear: null
    };

    const totalYears = data.length;
    const growthYears = data.filter(item => item.change_type === 'Increase').length;
    const declineYears = data.filter(item => item.change_type === 'Decrease').length;
    
    const avgGrowthRate = data.reduce((sum, item) => 
      sum + parseFloat(item.change_percentage || 0), 0) / totalYears;
    
    const bestYear = data.reduce((best, item) => 
      parseFloat(item.change_percentage) > parseFloat(best.change_percentage || -Infinity) ? item : best
    , data[0]);
    
    const worstYear = data.reduce((worst, item) => 
      parseFloat(item.change_percentage) < parseFloat(worst.change_percentage || Infinity) ? item : worst
    , data[0]);

    return {
      totalYears,
      growthYears,
      declineYears,
      avgGrowthRate,
      bestYear,
      worstYear
    };
  };

  const stats = calculateStats();

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
    if (percent < 0.014) return null; // Don't show label for slices < 1.4%
    
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

  // Prepare change type distribution
  const getChangeDistribution = () => {
    const distribution = {};
    data.forEach(item => {
      const type = item.change_type;
      distribution[type] = (distribution[type] || 0) + 1;
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  };

  const changeDistribution = getChangeDistribution();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Revenue Decrease Ratio (Year-over-Year)</h2>

      <h3 className="performance-heading">
        Historical Revenue Change Analysis
      </h3>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">Loading revenue comparison data...</div>
      ) : data.length === 0 ? (
        <div className="empty-state">No year-over-year data available</div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card summary-card-purple">
              <h4 className="card-title">Years Analyzed</h4>
              <p className="card-value">{stats.totalYears}</p>
            </div>
            
            <div className="summary-card summary-card-green">
              <h4 className="card-title">Growth Years</h4>
              <p className="card-value">{stats.growthYears}</p>
            </div>
            
            <div className="summary-card summary-card-pink">
              <h4 className="card-title">Decline Years</h4>
              <p className="card-value">{stats.declineYears}</p>
            </div>

            <div className="summary-card summary-card-blue">
              <h4 className="card-title">Avg Growth Rate</h4>
              <p className="card-value" style={{ 
                color: stats.avgGrowthRate >= 0 ? '#10b981' : '#ef4444',
                fontSize: '2rem'
              }}>
                {stats.avgGrowthRate >= 0 ? '+' : ''}{stats.avgGrowthRate.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Year Comparison Cards */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 className="section-title">Year-by-Year Comparison</h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              {data.map((item, index) => (
                <div 
                  key={index}
                  style={{
                    padding: '1.5rem',
                    background: 'white',
                    borderRadius: '8px',
                    border: `2px solid ${CHANGE_COLORS[item.change_type]}`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold',
                      color: '#1f2937'
                    }}>
                      {item.current_year} vs {item.previous_year}
                    </h3>
                    <div style={{ color: CHANGE_COLORS[item.change_type] }}>
                      {getChangeIcon(item.change_type)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '0.5rem',
                      background: '#f9fafb',
                      borderRadius: '4px'
                    }}>
                      <span style={{ fontWeight: '500' }}>{item.current_year} Revenue:</span>
                      <span style={{ fontWeight: 'bold', color: '#667eea' }}>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(item.current_year_revenue)}
                      </span>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '0.5rem',
                      background: '#f9fafb',
                      borderRadius: '4px'
                    }}>
                      <span style={{ fontWeight: '500' }}>{item.previous_year} Revenue:</span>
                      <span style={{ fontWeight: 'bold', color: '#9ca3af' }}>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(item.previous_year_revenue)}
                      </span>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      background: CHANGE_COLORS[item.change_type] + '15',
                      borderRadius: '4px',
                      marginTop: '0.5rem'
                    }}>
                      <span style={{ fontWeight: '600', fontSize: '1rem' }}>Change:</span>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          fontWeight: 'bold', 
                          fontSize: '1.25rem',
                          color: CHANGE_COLORS[item.change_type]
                        }}>
                          {item.change_percentage >= 0 ? '+' : ''}{parseFloat(item.change_percentage).toFixed(2)}%
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(Math.abs(item.revenue_change))}
                        </div>
                      </div>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      <span>Orders: {item.current_year_orders?.toLocaleString()}</span>
                      <span>vs {item.previous_year_orders?.toLocaleString()} ({item.order_change >= 0 ? '+' : ''}{item.order_change})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Comparison Bar Chart */}
          <div className="chart-container">
            <h4 className="section-title">Revenue Comparison by Year</h4>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="current_year"
                  label={{ value: 'Year Comparison', position: 'bottom', offset: 40 }}
                  style={{ fontSize: "12px", fill: "#6b7280" }}
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
                <Bar 
                  dataKey="current_year_revenue" 
                  name="Current Year Revenue" 
                  fill="#667eea"
                  radius={[6, 6, 0, 0]}
                />
                <Bar 
                  dataKey="previous_year_revenue" 
                  name="Previous Year Revenue" 
                  fill="#9ca3af"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Change Percentage Line Chart */}
          <div className="chart-container">
            <h4 className="section-title">Year-over-Year Change Percentage Trend</h4>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="colorChange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="current_year"
                  label={{ value: 'Year', position: 'bottom', offset: 40 }}
                  style={{ fontSize: "12px", fill: "#6b7280" }}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  label={{ value: 'Change %', angle: -90, position: 'insideLeft' }}
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
                  name="YoY Change %"
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

          {/* Charts Grid */}
          <div className="chart-grid">
            {/* Change Type Distribution */}
            <div className="chart-card">
              <h4 className="section-title">Growth vs Decline Distribution</h4>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={changeDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                    label={renderCustomLabel}
                    labelLine={true}
                  >
                    {changeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHANGE_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Order Change Chart */}
            <div className="chart-card">
              <h4 className="section-title">Order Volume Change YoY</h4>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="current_year"
                    style={{ fontSize: "12px", fill: "#6b7280" }}
                  />
                  <YAxis style={{ fontSize: "12px", fill: "#6b7280" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="order_change" name="Order Change" radius={[6, 6, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.order_change >= 0 ? '#10b981' : '#ef4444'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table */}
          <div className="table-container">
            <h4 className="section-title">Detailed Year-over-Year Breakdown</h4>
            <table className="data-table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Current Year</th>
                  <th className="table-header-cell">Previous Year</th>
                  <th className="table-header-cell-right">Current Revenue</th>
                  <th className="table-header-cell-right">Previous Revenue</th>
                  <th className="table-header-cell-right">Revenue Change</th>
                  <th className="table-header-cell-right">Change %</th>
                  <th className="table-header-cell-center">Status</th>
                  <th className="table-header-cell-right">Order Change</th>
                  <th className="table-header-cell-right">Order Change %</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell-bold">{item.current_year}</td>
                    <td className="table-cell">{item.previous_year}</td>
                    <td className="table-cell-blue">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.current_year_revenue)}
                    </td>
                    <td className="table-cell-right">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.previous_year_revenue)}
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
                      color: CHANGE_COLORS[item.change_type],
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
                        backgroundColor: CHANGE_COLORS[item.change_type] + '20',
                        color: CHANGE_COLORS[item.change_type]
                      }}>
                        {item.change_type}
                      </span>
                    </td>
                    <td className="table-cell-right" style={{
                      color: item.order_change >= 0 ? '#10b981' : '#ef4444'
                    }}>
                      {item.order_change >= 0 ? '+' : ''}{item.order_change}
                    </td>
                    <td className="table-cell-right">
                      {item.order_change_percentage >= 0 ? '+' : ''}{parseFloat(item.order_change_percentage).toFixed(2)}%
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
