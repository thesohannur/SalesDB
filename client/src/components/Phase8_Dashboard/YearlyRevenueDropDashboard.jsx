import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, TrendingDown, TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";
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

export default function YearlyRevenueDropDashboard() {
  const [data, setData] = useState([]);
  const [threshold, setThreshold] = useState(20);
  const [loading, setLoading] = useState(true);
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

  // Fetch data
  const fetchData = async (thresholdValue) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/revenue-drop/yearly?threshold=${thresholdValue}`);
      
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
      console.error("Failed to fetch yearly drop analysis:", err);
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
            {data.current_year} vs {data.previous_year}
          </p>
          <p className="tooltip-item-blue">
            {data.current_year}: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.current_revenue)}
          </p>
          <p className="tooltip-item-orange">
            {data.previous_year}: {new Intl.NumberFormat("en-US", {
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
        </div>
      );
    }
    return null;
  };

  // Calculate stats
  const calculateStats = () => {
    if (data.length === 0) return {
      totalYears: 0,
      criticalYears: 0,
      growthYears: 0,
      avgChange: 0,
      bestYear: null,
      worstYear: null
    };

    const totalYears = data.length;
    const criticalYears = data.filter(item => 
      item.drop_severity === 'Critical' || item.drop_severity === 'High'
    ).length;
    const growthYears = data.filter(item => parseFloat(item.change_percentage) > 0).length;
    
    const avgChange = data.reduce((sum, item) => 
      sum + parseFloat(item.change_percentage || 0), 0) / totalYears;
    
    const bestYear = data.reduce((best, item) => 
      parseFloat(item.change_percentage) > parseFloat(best.change_percentage || -Infinity) ? item : best
    , data[0]);

    const worstYear = data.reduce((worst, item) => 
      parseFloat(item.change_percentage) < parseFloat(worst.change_percentage || Infinity) ? item : worst
    , data[0]);

    return {
      totalYears,
      criticalYears,
      growthYears,
      avgChange,
      bestYear,
      worstYear
    };
  };

  const stats = calculateStats();

  // Get severity distribution
  const getSeverityDistribution = () => {
    const distribution = {};
    data.forEach(item => {
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

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Yearly Revenue Drop Analysis</h2>

      {/* Controls */}
      {/* <div className="year-selection">
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
      </div> */}

      <h3 className="performance-heading">
        Year-over-Year Revenue Analysis
      </h3>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">Loading yearly drop analysis...</div>
      ) : data.length === 0 ? (
        <div className="empty-state">No data available</div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card summary-card-purple">
              <h4 className="card-title">Years Analyzed</h4>
              <p className="card-value">{stats.totalYears}</p>
            </div>
            
            <div className="summary-card summary-card-pink">
              <h4 className="card-title">Problem Years</h4>
              <p className="card-value" >
                {stats.criticalYears}
              </p>
            </div>
            
            <div className="summary-card summary-card-blue">
              <h4 className="card-title">Growth Years</h4>
              <p className="card-value">{stats.growthYears}</p>
            </div>

            <div className="summary-card summary-card-orange">
              <h4 className="card-title">Avg Annual Change</h4>
              <p className="card-value" >
                {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Best and Worst Year Highlights */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {/* Best Year */}
            {stats.bestYear && parseFloat(stats.bestYear.change_percentage) > 0 && (
              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '8px',
                color: 'white',
                boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <TrendingUp size={24} />
                  <h4 style={{ fontSize: '1rem', opacity: 0.9 }}>Best Performing Year</h4>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {stats.bestYear.current_year}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  +{parseFloat(stats.bestYear.change_percentage).toFixed(2)}% Growth
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                  Top Category: {stats.bestYear.top_growth_category} 
                  (+{parseFloat(stats.bestYear.top_growth_percentage).toFixed(1)}%)
                </div>
              </div>
            )}

            {/* Worst Year */}
            {stats.worstYear && parseFloat(stats.worstYear.change_percentage) < -threshold && (
              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                borderRadius: '8px',
                color: 'white',
                boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <AlertTriangle size={24} />
                  <h4 style={{ fontSize: '1rem', opacity: 0.9 }}>Worst Performing Year</h4>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {stats.worstYear.current_year}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {parseFloat(stats.worstYear.change_percentage).toFixed(2)}% Decline
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                  Affected: {stats.worstYear.affected_category}
                  ({parseFloat(stats.worstYear.category_drop_percentage).toFixed(1)}%)
                </div>
              </div>
            )}
          </div>

          {/* Year Comparison Cards */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 className="section-title">Year-by-Year Performance</h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
                    border: `2px solid ${SEVERITY_COLORS[item.drop_severity]}`,
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
                      fontSize: '1.5rem', 
                      fontWeight: 'bold',
                      color: '#1f2937'
                    }}>
                      {item.current_year}
                    </h3>
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
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Revenue */}
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        Revenue
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#667eea' }}>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          notation: "compact",
                          maximumFractionDigits: 1
                        }).format(item.current_revenue)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        vs {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          notation: "compact",
                          maximumFractionDigits: 1
                        }).format(item.previous_revenue)} in {item.previous_year}
                      </div>
                    </div>

                    {/* Change */}
                    <div style={{ 
                      padding: '0.75rem',
                      background: SEVERITY_COLORS[item.drop_severity] + '15',
                      borderRadius: '4px'
                    }}>
                      <div style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold',
                        color: SEVERITY_COLORS[item.drop_severity]
                      }}>
                        {item.change_percentage >= 0 ? '+' : ''}{parseFloat(item.change_percentage).toFixed(2)}%
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          notation: "compact"
                        }).format(Math.abs(item.revenue_change))} {item.revenue_change >= 0 ? 'increase' : 'decrease'}
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div style={{ 
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.5rem',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Orders</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                          {item.current_orders?.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Customers</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                          {item.current_customers?.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>AOV</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(item.current_avg_order_value)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>AOV Change</div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '600',
                          color: (item.current_avg_order_value - item.previous_avg_order_value) >= 0 ? '#10b981' : '#ef4444'
                        }}>
                          {((item.current_avg_order_value - item.previous_avg_order_value) / item.previous_avg_order_value * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Annual Revenue Trend */}
          <div className="chart-container">
            <h4 className="section-title">Annual Revenue Trend</h4>
            <ResponsiveContainer width="100%" height={450}>
              <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="current_year"
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
                <Area
                  type="monotone"
                  dataKey="current_revenue"
                  fill="url(#colorRevenue)"
                  stroke="#667eea"
                  strokeWidth={3}
                  name="Annual Revenue"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Change Percentage and Severity */}
          <div className="chart-grid">
            {/* Year-over-Year Change */}
            <div className="chart-card">
              <h4 className="section-title">YoY Change Percentage</h4>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="current_year"
                    style={{ fontSize: "12px", fill: "#6b7280" }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value}%`}
                    style={{ fontSize: "12px", fill: "#6b7280" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="change_percentage" name="Change %" radius={[6, 6, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.change_percentage >= 0 ? '#10b981' : '#ef4444'}
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
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Severity Distribution */}
            <div className="chart-card">
              <h4 className="section-title">Severity Distribution</h4>
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
          </div>

          {/* Data Table */}
          <div className="table-container">
            <h4 className="section-title">Detailed Yearly Breakdown</h4>
            <table className="data-table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Year</th>
                  <th className="table-header-cell-right">Revenue</th>
                  <th className="table-header-cell-right">vs Prev Year</th>
                  <th className="table-header-cell-right">Change %</th>
                  <th className="table-header-cell-center">Severity</th>
                  <th className="table-header-cell-right">Orders</th>
                  <th className="table-header-cell-right">Customers</th>
                  <th className="table-header-cell-right">AOV</th>
                  <th className="table-header-cell">Top Growth</th>
                  <th className="table-header-cell">Most Affected</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell-bold">{item.current_year}</td>
                    <td className="table-cell-blue">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.current_revenue)}
                    </td>
                    <td className="table-cell-right" style={{
                      color: item.revenue_change >= 0 ? '#10b981' : '#ef4444',
                      fontWeight: 'bold'
                    }}>
                      {item.revenue_change >= 0 ? '+' : ''}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        notation: "compact"
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
                    <td className="table-cell-right">{item.current_orders?.toLocaleString()}</td>
                    <td className="table-cell-right">{item.current_customers?.toLocaleString()}</td>
                    <td className="table-cell-right">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.current_avg_order_value)}
                    </td>
                    <td className="table-cell">
                      {item.top_growth_category} 
                      {item.top_growth_percentage !== 0 && (
                        <span style={{ color: '#10b981', fontSize: '0.875rem' }}>
                          {' '}(+{parseFloat(item.top_growth_percentage).toFixed(1)}%)
                        </span>
                      )}
                    </td>
                    <td className="table-cell">
                      {item.affected_category}
                      {item.category_drop_percentage !== 0 && (
                        <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                          {' '}({parseFloat(item.category_drop_percentage).toFixed(1)}%)
                        </span>
                      )}
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
