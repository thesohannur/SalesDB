import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";
import "../styles/DashboardStyles.css";

export default function SellerHighReturnsRecentDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    days: 30,
    min_items: 10,
    min_return_rate: 0.30
  });

  // Fetch seller high returns data
  const fetchSellerHighReturns = async () => {
    try {
      setLoading(true);
      const url = `/api/fraud/seller-returns-recent?days=${filters.days}&min_items=${filters.min_items}&min_return_rate=${filters.min_return_rate}`;

      const res = await fetch(`${url}`);
      
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
      console.error("Failed to fetch seller high returns:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerHighReturns();
  }, [filters]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{data.seller_name}</p>
          <p className="tooltip-item-blue">
            Email: <strong>{data.contact_email}</strong>
          </p>
          <p className="tooltip-item-green">
            Items Sold: <strong>{data.items_sold}</strong>
          </p>
          <p className="tooltip-item-orange">
            Returns: <strong>{data.returns_count}</strong>
          </p>
          <p className="tooltip-item" style={{ color: '#ef4444', fontWeight: 'bold' }}>
            Return Rate: {parseFloat(data.return_percentage).toFixed(2)}%
          </p>
          <p className="tooltip-item">
            Period: Last {data.period_days} days
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate summary statistics
  const calculateStats = () => {
    if (data.length === 0) return { 
      totalSellers: 0,
      totalReturns: 0, 
      avgReturnRate: 0,
      totalItemsSold: 0
    };
    
    const totalSellers = data.length;
    const totalReturns = data.reduce((sum, item) => sum + parseInt(item.returns_count || 0), 0);
    const totalItemsSold = data.reduce((sum, item) => sum + parseInt(item.items_sold || 0), 0);
    const avgReturnRate = data.reduce((sum, item) => sum + parseFloat(item.return_percentage || 0), 0) / totalSellers;
    
    return { totalSellers, totalReturns, avgReturnRate, totalItemsSold };
  };

  const stats = calculateStats();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Seller High Returns (Recent Period) - Quality Alert</h2>

      {/* Filters */}
      <div style={{ 
        marginBottom: "20px", 
        display: "flex", 
        gap: "20px", 
        alignItems: "center",
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        border: "2px solid #e5e7eb",
        flexWrap: "wrap"
      }}>
        <div>
          <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
            Time Period (Days):
          </label>
          <select
            value={filters.days}
            onChange={(e) => setFilters({...filters, days: parseInt(e.target.value)})}
            className="year-select"
          >
            <option value={7}>Last 7 Days</option>
            <option value={15}>Last 15 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={60}>Last 60 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </div>
        
        <div>
          <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
            Min Items Sold:
          </label>
          <select
            value={filters.min_items}
            onChange={(e) => setFilters({...filters, min_items: parseInt(e.target.value)})}
            className="year-select"
          >
            <option value={5}>5+</option>
            <option value={10}>10+</option>
            <option value={20}>20+</option>
            <option value={50}>50+</option>
          </select>
        </div>
        
        <div>
          <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
            Min Return Rate:
          </label>
          <select
            value={filters.min_return_rate}
            onChange={(e) => setFilters({...filters, min_return_rate: parseFloat(e.target.value)})}
            className="year-select"
          >
            <option value={0.20}>20%+</option>
            <option value={0.30}>30%+</option>
            <option value={0.40}>40%+</option>
            <option value={0.50}>50%+</option>
          </select>
        </div>
      </div>

      <h3 className="performance-heading">
        Sellers with {filters.min_items}+ items sold and >{(filters.min_return_rate * 100).toFixed(0)}% return rate in last {filters.days} days
      </h3>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">Loading seller quality data...</div>
      ) : data.length === 0 ? (
        <div className="empty-state">✅ No sellers with high return rates detected</div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card summary-card-purple" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
              <h4 className="card-title">Flagged Sellers</h4>
              <p className="card-value">{stats.totalSellers}</p>
            </div>
            
            <div className="summary-card summary-card-pink" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <h4 className="card-title">Total Returns</h4>
              <p className="card-value">{stats.totalReturns}</p>
            </div>
            
            <div className="summary-card summary-card-blue">
              <h4 className="card-title">Avg Return Rate</h4>
              <p className="card-value">{stats.avgReturnRate.toFixed(1)}%</p>
            </div>

            <div className="summary-card summary-card-orange">
              <h4 className="card-title">Total Items Sold</h4>
              <p className="card-value">{stats.totalItemsSold.toLocaleString()}</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="chart-grid">
            {/* Return Rate by Seller */}
            <div className="chart-card">
              <h4 className="section-title">Return Rate % by Seller (Top 15)</h4>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={data.slice(0, 15)} 
                  margin={{ top: 10, right: 10, left: 10, bottom: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="seller_name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    style={{ fontSize: "11px", fill: "#6b7280" }}
                  />
                  <YAxis style={{ fontSize: "12px", fill: "#6b7280" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="return_percentage" name="Return Rate %" radius={[6, 6, 0, 0]}>
                    {data.slice(0, 15).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.return_percentage >= 50 ? '#ef4444' : entry.return_percentage >= 40 ? '#f59e0b' : '#fbbf24'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Items Sold vs Returns */}
            <div className="chart-card">
              <h4 className="section-title">Items Sold vs Returns (Top 15)</h4>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={data.slice(0, 15)} 
                  margin={{ top: 10, right: 10, left: 10, bottom: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="seller_name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    style={{ fontSize: "11px", fill: "#6b7280" }}
                  />
                  <YAxis style={{ fontSize: "12px", fill: "#6b7280" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="items_sold" fill="#10b981" name="Items Sold" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="returns_count" fill="#ef4444" name="Returns" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Return Rate Trend Line */}
          <div className="chart-container">
            <h4 className="section-title">Return Rate Trend (All Flagged Sellers)</h4>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart 
                data={data} 
                margin={{ top: 10, right: 30, left: 10, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="seller_name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  style={{ fontSize: "10px", fill: "#6b7280" }}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  style={{ fontSize: "12px", fill: "#6b7280" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="return_percentage" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#ef4444" }}
                  activeDot={{ r: 6 }}
                  name="Return Rate %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div className="table-container">
            <h4 className="section-title">Seller Quality Alert List</h4>
            <table className="data-table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Rank</th>
                  <th className="table-header-cell">Seller ID</th>
                  <th className="table-header-cell">Seller Name</th>
                  <th className="table-header-cell">Contact Email</th>
                  <th className="table-header-cell-right">Items Sold</th>
                  <th className="table-header-cell-right">Returns</th>
                  <th className="table-header-cell-right">Return Rate %</th>
                  <th className="table-header-cell-center">Period</th>
                </tr>
              </thead>
              <tbody>
                {data.map((seller, index) => {
                  const returnRate = parseFloat(seller.return_percentage);
                  const riskColor = returnRate >= 50 ? '#ef4444' : 
                                   returnRate >= 40 ? '#f59e0b' : '#fbbf24';
                  
                  return (
                    <tr key={index} className="table-row">
                      <td className="table-cell">{index + 1}</td>
                      <td className="table-cell">{seller.seller_id}</td>
                      <td className="table-cell-bold">{seller.seller_name}</td>
                      <td className="table-cell">{seller.contact_email}</td>
                      <td className="table-cell-right">{seller.items_sold}</td>
                      <td className="table-cell-right" style={{ color: '#ef4444', fontWeight: '700' }}>
                        {seller.returns_count}
                      </td>
                      <td className="table-cell-right" style={{ color: riskColor, fontWeight: '700' }}>
                        {returnRate.toFixed(2)}%
                      </td>
                      <td className="table-cell-center">{seller.period_days} days</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}