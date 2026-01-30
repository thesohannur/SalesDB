import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Users, ShoppingCart } from "lucide-react";
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

export default function YoYRevenueGrowthDashboard() {
  const [growthData, setGrowthData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const STATUS_COLORS = {
    'Growth': '#10b981',
    'Decline': '#ef4444',
    'Stable': '#6b7280'
  };

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

  // Fetch YoY Revenue Growth data
  const fetchYoYRevenueGrowth = async (year) => {
    try {
      setLoading(true);
      let url = `/api/yoy/revenue-growth`;
      
      if (year !== "all") {
        url += `?year=${year}`;
      }

      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const text = await res.text();
      if (!text || text.trim() === '') {
        console.warn("Empty response from server");
        setGrowthData(null);
        return;
      }
      
      const json = JSON.parse(text);
      
      if (Array.isArray(json) && json.length > 0) {
        setGrowthData(json[0]); // Function returns single row
      } else {
        console.error("Expected array with data but got:", json);
        setGrowthData(null);
      }
    } catch (err) {
      console.error("Failed to fetch YoY revenue growth:", err);
      setGrowthData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Monthly YoY Comparison
  const fetchMonthlyComparison = async (year) => {
    try {
      let url = `/api/yoy/monthly-comparison`;
      
      if (year !== "all") {
        url += `?year=${year}`;
      }

      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const text = await res.text();
      if (!text || text.trim() === '') {
        console.warn("Empty response from server");
        setMonthlyData([]);
        return;
      }
      
      const json = JSON.parse(text);
      
      if (Array.isArray(json)) {
        setMonthlyData(json);
      } else {
        console.error("Expected array but got:", json);
        setMonthlyData([]);
      }
    } catch (err) {
      console.error("Failed to fetch monthly comparison:", err);
      setMonthlyData([]);
    }
  };

  // Fetch years on component mount
  useEffect(() => {
    fetchYears();
  }, []);

  // Fetch data whenever selectedYear changes
  useEffect(() => {
    if (selectedYear !== "all") {
      fetchYoYRevenueGrowth(selectedYear);
      fetchMonthlyComparison(selectedYear);
    } else {
      // For "all", get latest year
      if (years.length > 0) {
        const latestYear = Math.max(...years);
        fetchYoYRevenueGrowth(latestYear);
        fetchMonthlyComparison(latestYear);
      }
    }
  }, [selectedYear, years]);

  // Custom tooltip for monthly data
  const MonthlyTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{data.month_name}</p>
          <p className="tooltip-item-blue">
            {data.current_year}: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.current_year_revenue)}
          </p>
          <p className="tooltip-item-orange">
            {data.previous_year}: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.previous_year_revenue)}
          </p>
          <p className="tooltip-item" style={{ 
            fontWeight: 'bold',
            color: data.change_percentage >= 0 ? '#10b981' : '#ef4444'
          }}>
            Change: {data.change_percentage >= 0 ? '+' : ''}{parseFloat(data.change_percentage).toFixed(2)}%
          </p>
          <p className="tooltip-item-green">
            Orders: {data.current_year_orders?.toLocaleString()} vs {data.previous_year_orders?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

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
      <h2 className="dashboard-title">Year-over-Year Revenue Growth Analysis</h2>

      {/* Year Selection Dropdown */}
      <div className="year-selection">
        <label htmlFor="year-select" className="year-label">
          Select Year to Compare:
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="year-select"
        >
          <option value="all">Latest Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">Loading YoY growth data...</div>
      ) : !growthData ? (
        <div className="empty-state">No year-over-year comparison data available</div>
      ) : (
        <div>
          <h3 className="performance-heading">
            {growthData.analysis_year} vs {growthData.comparison_year} Performance
          </h3>

          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card summary-card-purple">
              <h4 className="card-title">{growthData.analysis_year} Revenue</h4>
              <p className="card-value">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(growthData.current_revenue)}
              </p>
            </div>
            
            <div className="summary-card summary-card-pink">
              <h4 className="card-title">Revenue Growth</h4>
              <p className="card-value" style={{ 
                color: STATUS_COLORS[growthData.growth_status]
              }}>
                {growthData.growth_percentage >= 0 ? '+' : ''}{parseFloat(growthData.growth_percentage).toFixed(2)}%
              </p>
            </div>
            
            <div className="summary-card summary-card-blue">
              <h4 className="card-title">AOV Growth</h4>
              <p className="card-value" style={{ 
                color: growthData.aov_growth_percentage >= 0 ? '#10b981' : '#ef4444',
                fontSize: '2rem'
              }}>
                {growthData.aov_growth_percentage >= 0 ? '+' : ''}{parseFloat(growthData.aov_growth_percentage).toFixed(2)}%
              </p>
            </div>

            <div className="summary-card summary-card-green">
              <h4 className="card-title">Customer Growth</h4>
              <p className="card-value">
                {((growthData.current_customers - growthData.previous_customers) / growthData.previous_customers * 100).toFixed(2)}%
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                +{growthData.current_customers - growthData.previous_customers} customers
              </p>
            </div>
          </div>

          {/* Key Metrics Comparison */}
          <div style={{ 
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h4 className="section-title">Key Performance Indicators</h4>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginTop: '1rem'
            }}>
              {/* Revenue Comparison */}
              <div style={{ 
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '6px',
                borderLeft: '4px solid #667eea'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  Revenue
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        notation: "compact",
                        maximumFractionDigits: 1
                      }).format(growthData.current_revenue)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      vs {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        notation: "compact",
                        maximumFractionDigits: 1
                      }).format(growthData.previous_revenue)}
                    </div>
                  </div>
                  <div style={{ 
                    color: STATUS_COLORS[growthData.growth_status],
                    fontWeight: 'bold'
                  }}>
                    {growthData.growth_status === 'Growth' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                  </div>
                </div>
              </div>

              {/* Orders Comparison */}
              <div style={{ 
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '6px',
                borderLeft: '4px solid #10b981'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  <ShoppingCart size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Orders
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                      {growthData.current_orders?.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      vs {growthData.previous_orders?.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ 
                    color: growthData.current_orders >= growthData.previous_orders ? '#10b981' : '#ef4444',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}>
                    {growthData.current_orders >= growthData.previous_orders ? '+' : ''}
                    {((growthData.current_orders - growthData.previous_orders) / growthData.previous_orders * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Customers Comparison */}
              <div style={{ 
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '6px',
                borderLeft: '4px solid #f59e0b'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  <Users size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Customers
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                      {growthData.current_customers?.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      vs {growthData.previous_customers?.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ 
                    color: growthData.current_customers >= growthData.previous_customers ? '#10b981' : '#ef4444',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}>
                    {growthData.current_customers >= growthData.previous_customers ? '+' : ''}
                    {((growthData.current_customers - growthData.previous_customers) / growthData.previous_customers * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* AOV Comparison */}
              <div style={{ 
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '6px',
                borderLeft: '4px solid #ec4899'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  Avg Order Value
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(growthData.current_avg_order_value)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      vs {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(growthData.previous_avg_order_value)}
                    </div>
                  </div>
                  <div style={{ 
                    color: growthData.aov_growth_percentage >= 0 ? '#10b981' : '#ef4444',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}>
                    {growthData.aov_growth_percentage >= 0 ? '+' : ''}
                    {parseFloat(growthData.aov_growth_percentage).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Performance Highlights */}
          {growthData.top_growth_category !== '-' && (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {/* Top Growth Category */}
              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '8px',
                color: 'white',
                boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
              }}>
                <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                  🏆 Top Growth Category
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {growthData.top_growth_category}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  +{parseFloat(growthData.top_growth_category_percentage).toFixed(2)}%
                </div>
              </div>

              {/* Top Decline Category */}
              {growthData.top_decline_category !== '-' && (
                <div style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  borderRadius: '8px',
                  color: 'white',
                  boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)'
                }}>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                    ⚠️ Needs Attention
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {growthData.top_decline_category}
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {parseFloat(growthData.top_decline_category_percentage).toFixed(2)}%
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Monthly Revenue Comparison */}
          {monthlyData.length > 0 && (
            <>
              <div className="chart-container">
                <h4 className="section-title">Monthly Revenue Comparison</h4>
                <ResponsiveContainer width="100%" height={450}>
                  <ComposedChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <defs>
                      <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#764ba2" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month_name"
                      tickFormatter={getMonthAbbr}
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
                    <Tooltip content={<MonthlyTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="current_year_revenue"
                      fill="url(#colorCurrent)"
                      stroke="#667eea"
                      strokeWidth={3}
                      name={`${growthData.analysis_year} Revenue`}
                    />
                    <Line
                      type="monotone"
                      dataKey="previous_year_revenue"
                      stroke="#9ca3af"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 3, fill: "#9ca3af" }}
                      name={`${growthData.comparison_year} Revenue`}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Change Percentage */}
              <div className="chart-container">
                <h4 className="section-title">Month-by-Month Growth Rate</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis 
                      dataKey="month_name"
                      tickFormatter={getMonthAbbr}
                      style={{ fontSize: "12px", fill: "#6b7280" }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}%`}
                      style={{ fontSize: "12px", fill: "#6b7280" }}
                    />
                    <Tooltip content={<MonthlyTooltip />} />
                    <Bar dataKey="change_percentage" name="Growth %" radius={[6, 6, 0, 0]}>
                      {monthlyData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.change_percentage >= 0 ? '#10b981' : '#ef4444'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {/* Data Table */}
          {monthlyData.length > 0 && (
            <div className="table-container">
              <h4 className="section-title">Monthly Detailed Comparison</h4>
              <table className="data-table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Month</th>
                    <th className="table-header-cell-right">{growthData.analysis_year} Revenue</th>
                    <th className="table-header-cell-right">{growthData.comparison_year} Revenue</th>
                    <th className="table-header-cell-right">Change</th>
                    <th className="table-header-cell-right">Change %</th>
                    <th className="table-header-cell-right">{growthData.analysis_year} Orders</th>
                    <th className="table-header-cell-right">{growthData.comparison_year} Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((month, index) => (
                    <tr key={index} className="table-row">
                      <td className="table-cell-bold">{month.month_name?.trim()}</td>
                      <td className="table-cell-blue">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(month.current_year_revenue)}
                      </td>
                      <td className="table-cell-right">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(month.previous_year_revenue)}
                      </td>
                      <td className="table-cell-right" style={{
                        color: month.revenue_change >= 0 ? '#10b981' : '#ef4444',
                        fontWeight: 'bold'
                      }}>
                        {month.revenue_change >= 0 ? '+' : ''}
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(month.revenue_change)}
                      </td>
                      <td className="table-cell-right" style={{
                        color: month.change_percentage >= 0 ? '#10b981' : '#ef4444',
                        fontWeight: 'bold'
                      }}>
                        {month.change_percentage >= 0 ? '+' : ''}{parseFloat(month.change_percentage).toFixed(2)}%
                      </td>
                      <td className="table-cell-right">{month.current_year_orders?.toLocaleString()}</td>
                      <td className="table-cell-right">{month.previous_year_orders?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
