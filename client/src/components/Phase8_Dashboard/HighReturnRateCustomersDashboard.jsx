import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
} from "recharts";
import "../styles/DashboardStyles.css";

export default function HighReturnCustomersDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    min_returns: 3,
    min_percentage: 10
  });

  // Fetch high return customers data
  const fetchHighReturnCustomers = async () => {
    try {
      setLoading(true);
      const url = `/api/fraud/high-return-customers?min_returns=${filters.min_returns}&min_percentage=${filters.min_percentage}`;

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
      console.error("Failed to fetch high return customers:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighReturnCustomers();
  }, [filters]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{data.first_name} {data.last_name}</p>
          <p className="tooltip-item-blue">
            Email: <strong>{data.email}</strong>
          </p>
          <p className="tooltip-item-orange">
            Returns: <strong>{data.total_returns}</strong> / {data.total_items} items
          </p>
          <p className="tooltip-item" style={{ color: '#ef4444', fontWeight: 'bold' }}>
            Return Rate: {parseFloat(data.return_percentage).toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate summary statistics
  const calculateStats = () => {
    if (data.length === 0) return { 
      totalCustomers: 0,
      totalReturns: 0, 
      avgReturnRate: 0,
      highestReturnRate: 0
    };
    
    const totalCustomers = data.length;
    const totalReturns = data.reduce((sum, item) => sum + parseInt(item.total_returns || 0), 0);
    const avgReturnRate = data.reduce((sum, item) => sum + parseFloat(item.return_percentage || 0), 0) / totalCustomers;
    const highestReturnRate = Math.max(...data.map(item => parseFloat(item.return_percentage || 0)));
    
    return { totalCustomers, totalReturns, avgReturnRate, highestReturnRate };
  };

  const stats = calculateStats();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">High Return Rate Customers - Fraud Detection</h2>

      {/* Filters */}
      <div style={{ 
        marginBottom: "20px", 
        display: "flex", 
        gap: "20px", 
        alignItems: "center",
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        border: "2px solid #e5e7eb"
      }}>
        <div>
          <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
            Minimum Returns:
          </label>
          <select
            value={filters.min_returns}
            onChange={(e) => setFilters({...filters, min_returns: parseInt(e.target.value)})}
            className="year-select"
          >
            <option value={3}>3+</option>
            <option value={5}>5+</option>
            <option value={10}>10+</option>
          </select>
        </div>
        
        <div>
          <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
            Minimum Return Rate (%):
          </label>
          <select
            value={filters.min_percentage}
            onChange={(e) => setFilters({...filters, min_percentage: parseFloat(e.target.value)})}
            className="year-select"
          >
            <option value={10}>10%+</option>
            <option value={20}>20%+</option>
            <option value={30}>30%+</option>
            <option value={50}>50%+</option>
          </select>
        </div>
      </div>

      <h3 className="performance-heading">
        Customers with {filters.min_returns}+ returns and '&gt' {filters.min_percentage}% return rate
      </h3>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">Loading fraud detection data...</div>
      ) : data.length === 0 ? (
        <div className="empty-state">No high return rate customers detected</div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card summary-card-purple" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
              <h4 className="card-title">Flagged Customers</h4>
              <p className="card-value">{stats.totalCustomers}</p>
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
              <h4 className="card-title">Highest Return Rate</h4>
              <p className="card-value">{stats.highestReturnRate.toFixed(1)}%</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="chart-grid">
            {/* Return Rate by Customer */}
            <div className="chart-card">
              <h4 className="section-title">Return Rate % (Top 15)</h4>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={data.slice(0, 15)} 
                  margin={{ top: 10, right: 10, left: 10, bottom: 80 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" style={{ fontSize: "12px", fill: "#6b7280" }} />
                  <YAxis 
                    type="category"
                    dataKey="email"
                    width={200}
                    style={{ fontSize: "11px", fill: "#6b7280" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="return_percentage" name="Return Rate %" radius={[0, 6, 6, 0]}>
                    {data.slice(0, 15).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.return_percentage >= 50 ? '#ef4444' : entry.return_percentage >= 30 ? '#f59e0b' : '#fbbf24'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Returns vs Items Scatter */}
            <div className="chart-card">
              <h4 className="section-title">Returns vs Total Items</h4>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    type="number" 
                    dataKey="total_items" 
                    name="Total Items"
                    label={{ value: 'Total Items', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="total_returns" 
                    name="Returns"
                    label={{ value: 'Returns', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Customers" data={data} fill="#ef4444" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table */}
          <div className="table-container">
            <h4 className="section-title">High Return Rate Alert List</h4>
            <table className="data-table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Rank</th>
                  <th className="table-header-cell">Customer ID</th>
                  <th className="table-header-cell">Name</th>
                  <th className="table-header-cell">Email</th>
                  <th className="table-header-cell-right">Returns</th>
                  <th className="table-header-cell-right">Total Items</th>
                  <th className="table-header-cell-right">Return Rate %</th>
                </tr>
              </thead>
              <tbody>
                {data.map((customer, index) => {
                  const returnRate = parseFloat(customer.return_percentage);
                  const riskColor = returnRate >= 50 ? '#ef4444' : 
                                   returnRate >= 30 ? '#f59e0b' : '#fbbf24';
                  
                  return (
                    <tr key={index} className="table-row">
                      <td className="table-cell">{index + 1}</td>
                      <td className="table-cell">{customer.customer_id}</td>
                      <td className="table-cell-bold">{customer.first_name} {customer.last_name}</td>
                      <td className="table-cell">{customer.email}</td>
                      <td className="table-cell-right" style={{ color: '#ef4444', fontWeight: '700' }}>
                        {customer.total_returns}
                      </td>
                      <td className="table-cell-right">{customer.total_items}</td>
                      <td className="table-cell-right" style={{ color: riskColor, fontWeight: '700' }}>
                        {returnRate.toFixed(2)}%
                      </td>
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