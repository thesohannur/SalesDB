import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../styles/DashboardStyles.css";

export default function FailedPaymentsDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    days: 15,
    min_attempts: 2
  });

  // Fetch failed payments data
  const fetchFailedPayments = async () => {
    try {
      setLoading(true);
      const url = `/api/fraud/failed-payments?days=${filters.days}&min_attempts=${filters.min_attempts}`;

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
      console.error("Failed to fetch failed payments data:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFailedPayments();
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
            Failed Attempts: <strong>{data.failed_attempts}</strong>
          </p>
          <p className="tooltip-item">
            Last Failed: {new Date(data.last_failed_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
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
      totalAttempts: 0, 
      avgAttempts: 0,
      highestAttempts: 0
    };
    
    const totalCustomers = data.length;
    const totalAttempts = data.reduce((sum, item) => sum + parseInt(item.failed_attempts || 0), 0);
    const avgAttempts = totalCustomers > 0 ? totalAttempts / totalCustomers : 0;
    const highestAttempts = Math.max(...data.map(item => parseInt(item.failed_attempts || 0)));
    
    return { totalCustomers, totalAttempts, avgAttempts, highestAttempts };
  };

  const stats = calculateStats();

  // Get risk distribution
  const getRiskDistribution = () => {
    const critical = data.filter(c => c.failed_attempts >= 5).length;
    const high = data.filter(c => c.failed_attempts >= 3 && c.failed_attempts < 5).length;
    const medium = data.filter(c => c.failed_attempts === 2).length;
    
    return [
      { name: 'Critical (5+)', value: critical, color: '#ef4444' },
      { name: 'High (3-4)', value: high, color: '#f59e0b' },
      { name: 'Medium (2)', value: medium, color: '#fbbf24' }
    ].filter(item => item.value > 0);
  };

  const riskDistribution = getRiskDistribution();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Multiple Failed Payments - Fraud Detection</h2>

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
          </select>
        </div>
        
        <div>
          <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
            Minimum Attempts:
          </label>
          <select
            value={filters.min_attempts}
            onChange={(e) => setFilters({...filters, min_attempts: parseInt(e.target.value)})}
            className="year-select"
          >
            <option value={2}>2+</option>
            <option value={3}>3+</option>
            <option value={5}>5+</option>
          </select>
        </div>
      </div>

      <h3 className="performance-heading">
        Customers with {filters.min_attempts}+ failed payment attempts in last {filters.days} days
      </h3>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">Loading fraud detection data...</div>
      ) : data.length === 0 ? (
        <div className="empty-state">✅ No suspicious payment activity detected</div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card summary-card-purple" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
              <h4 className="card-title">Flagged Customers</h4>
              <p className="card-value">{stats.totalCustomers}</p>
            </div>
            
            <div className="summary-card summary-card-pink" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <h4 className="card-title">Total Failed Attempts</h4>
              <p className="card-value">{stats.totalAttempts}</p>
            </div>
            
            <div className="summary-card summary-card-blue">
              <h4 className="card-title">Avg Attempts/Customer</h4>
              <p className="card-value">{stats.avgAttempts.toFixed(1)}</p>
            </div>

            <div className="summary-card summary-card-orange">
              <h4 className="card-title">Highest Attempts</h4>
              <p className="card-value">{stats.highestAttempts}</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="chart-grid">
            {/* Failed Attempts by Customer */}
            <div className="chart-card">
              <h4 className="section-title">Failed Attempts by Customer (Top 15)</h4>
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
                  <Bar dataKey="failed_attempts" name="Failed Attempts" radius={[0, 6, 6, 0]}>
                    {data.slice(0, 15).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.failed_attempts >= 5 ? '#ef4444' : entry.failed_attempts >= 3 ? '#f59e0b' : '#fbbf24'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Distribution */}
            <div className="chart-card">
              <h4 className="section-title">Risk Level Distribution</h4>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table */}
          <div className="table-container">
            <h4 className="section-title">Detailed Fraud Alert List</h4>
            <table className="data-table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Risk</th>
                  <th className="table-header-cell">Customer ID</th>
                  <th className="table-header-cell">Name</th>
                  <th className="table-header-cell">Email</th>
                  <th className="table-header-cell-right">Failed Attempts</th>
                  <th className="table-header-cell">Last Failed Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((customer, index) => {
                  const riskLevel = customer.failed_attempts >= 5 ? 'CRITICAL' : 
                                   customer.failed_attempts >= 3 ? 'HIGH' : 'MEDIUM';
                  const riskColor = customer.failed_attempts >= 5 ? '#ef4444' : 
                                   customer.failed_attempts >= 3 ? '#f59e0b' : '#fbbf24';
                  
                  return (
                    <tr key={index} className="table-row">
                      <td className="table-cell">
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor: `${riskColor}20`,
                          color: riskColor
                        }}>
                          {riskLevel}
                        </span>
                      </td>
                      <td className="table-cell">{customer.customer_id}</td>
                      <td className="table-cell-bold">{customer.first_name} {customer.last_name}</td>
                      <td className="table-cell">{customer.email}</td>
                      <td className="table-cell-right" style={{ color: riskColor, fontWeight: '700' }}>
                        {customer.failed_attempts}
                      </td>
                      <td className="table-cell">
                        {new Date(customer.last_failed_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
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