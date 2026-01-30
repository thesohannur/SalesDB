import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/DashboardStyles.css";

export default function CustomerLifetimeValueDashboard() {
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const SEGMENT_COLORS = {
    'VIP': '#8b5cf6',
    'High Value': '#10b981',
    'Medium Value': '#f59e0b',
    'Low Value': '#ef4444'
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

  // Fetch CLTV data
  const fetchCustomerLifetimeValue = async (year) => {
    try {
      setLoading(true);
      let url = `/api/customer-lifetime-value`;
      
      if (year !== "all") {
        url += `?year=${year}`;
      }

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
      console.error("Failed to fetch CLTV data:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch years on component mount
  useEffect(() => {
    fetchYears();
  }, []);

  // Fetch data whenever selectedYear changes
  useEffect(() => {
    fetchCustomerLifetimeValue(selectedYear);
  }, [selectedYear]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{data.customer_name}</p>
          <p className="tooltip-item-blue">
            CLTV: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.total_revenue)}
          </p>
          <p className="tooltip-item-green">
            Orders: <strong>{data.total_orders?.toLocaleString()}</strong>
          </p>
          <p className="tooltip-item-orange">
            Avg Order: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.avg_order_value)}
          </p>
          <p className="tooltip-item">
            Segment: <strong>{data.customer_segment}</strong>
          </p>
          <p className="tooltip-item">
            Lifetime: <strong>{data.customer_lifetime_days} days</strong>
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
      totalRevenue: 0, 
      avgCLTV: 0,
      topCustomer: "-",
      vipCount: 0,
      avgLifetimeDays: 0
    };
    
    const totalCustomers = data.length;
    const totalRevenue = data.reduce((sum, item) => sum + parseFloat(item.total_revenue || 0), 0);
    const avgCLTV = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
    
    const topCustomer = data[0]?.customer_name || "-";
    const vipCount = data.filter(item => item.customer_segment === 'VIP').length;
    
    const totalLifetimeDays = data.reduce((sum, item) => sum + parseInt(item.customer_lifetime_days || 0), 0);
    const avgLifetimeDays = totalCustomers > 0 ? totalLifetimeDays / totalCustomers : 0;
    
    return { 
      totalCustomers,
      totalRevenue, 
      avgCLTV,
      topCustomer,
      vipCount,
      avgLifetimeDays
    };
  };

  const stats = calculateStats();

  // Group data by segment for pie chart
  const getSegmentData = () => {
    const segments = {};
    data.forEach(customer => {
      const segment = customer.customer_segment;
      if (!segments[segment]) {
        segments[segment] = { name: segment, value: 0, count: 0 };
      }
      segments[segment].value += parseFloat(customer.total_revenue);
      segments[segment].count += 1;
    });
    return Object.values(segments);
  };

  const segmentData = getSegmentData();

  // Get top 20 customers
  const topCustomers = data.slice(0, 20);

  return (
    <div className="dashboard-container">
      
      <h2 className="dashboard-title">Customer Lifetime Value (CLTV) Dashboard</h2>

      {/* Year Selection Dropdown */}
      <div className="year-selection">
        <label htmlFor="year-select" className="year-label">
          Select Year:
        </label>
        <select
          id="year-select"
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

     <h3 className="performance-heading">
        {selectedYear === "all" ? "All Time Performance" : `Performance in ${selectedYear}`}
      </h3>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">Loading CLTV data...</div>
      ) : data.length === 0 ? (
        <div className="empty-state">No data available for the selected year</div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card summary-card-purple">
              <h4 className="card-title">Total Customers</h4>
              <p className="card-value">{stats.totalCustomers.toLocaleString()}</p>
            </div>
            
            <div className="summary-card summary-card-pink">
              <h4 className="card-title">Total Revenue</h4>
              <p className="card-value">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(stats.totalRevenue)}
              </p>
            </div>
            
            <div className="summary-card summary-card-blue">
              <h4 className="card-title">Average CLTV</h4>
              <p className="card-value">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(stats.avgCLTV)}
              </p>
            </div>

            <div className="summary-card summary-card-orange">
              <h4 className="card-title">VIP Customers</h4>
              <p className="card-value">{stats.vipCount.toLocaleString()}</p>
            </div>
          </div>

          {/* Top 20 Customers Bar Chart */}
          <div className="chart-container">
            <h4 className="section-title">Top 20 Customers by Lifetime Value</h4>
            <ResponsiveContainer width="100%" height={Math.max(500, topCustomers.length * 30)}>
              <BarChart
                layout="vertical"
                data={topCustomers}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  tickFormatter={(value) => {
                    if (value >= 1_000_000) return "$" + (value / 1_000_000).toFixed(1) + "M";
                    if (value >= 1_000) return "$" + (value / 1_000).toFixed(1) + "K";
                    return "$" + value;
                  }}
                  style={{ fontSize: "12px", fill: "#666" }}
                />
                <YAxis 
                  type="category" 
                  dataKey="customer_name" 
                  width={150}
                  interval={0}
                  style={{ fontSize: "11px", fill: "#666" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total_revenue" name="CLTV" radius={[0, 6, 6, 0]}>
                  {topCustomers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[entry.customer_segment] || '#8884d8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Segment Distribution and Stats */}
          <div className="chart-grid">
            {/* Segment Distribution Pie Chart */}
            <div className="chart-card">
              <h4 className="section-title">Revenue by Customer Segment</h4>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={segmentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                    labelLine={true}
                  >
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[entry.name] || '#8884d8'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(value)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Customer Count by Segment */}
            <div className="chart-card">
              <h4 className="section-title">Customer Count by Segment</h4>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={segmentData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    style={{ fontSize: "12px", fill: "#6b7280" }}
                  />
                  <YAxis style={{ fontSize: "12px", fill: "#6b7280" }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Customers" radius={[6, 6, 0, 0]}>
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[entry.name] || '#8884d8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        
          {/* Data Table */}
          <div className="table-container">
            <h4 className="section-title">Detailed Customer Breakdown</h4>
            <table className="data-table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Rank</th>
                  <th className="table-header-cell">Customer Name</th>
                  <th className="table-header-cell-center">Segment</th>
                  <th className="table-header-cell-right">CLTV</th>
                  <th className="table-header-cell-right">Orders</th>
                  <th className="table-header-cell-right">Avg Order</th>
                  <th className="table-header-cell-right">Lifetime (Days)</th>
                  <th className="table-header-cell-right">Frequency</th>
                  <th className="table-header-cell">First Purchase</th>
                  <th className="table-header-cell">Last Purchase</th>
                </tr>
              </thead>
              <tbody>
                {data.map((customer, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell">{index + 1}</td>
                    <td className="table-cell-bold">{customer.customer_name}</td>
                    <td className="table-cell-center">
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        backgroundColor: SEGMENT_COLORS[customer.customer_segment] + '20',
                        color: SEGMENT_COLORS[customer.customer_segment]
                      }}>
                        {customer.customer_segment}
                      </span>
                    </td>
                    <td className="table-cell-green">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(customer.total_revenue)}
                    </td>
                    <td className="table-cell-right">{customer.total_orders}</td>
                    <td className="table-cell-blue">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(customer.avg_order_value)}
                    </td>
                    <td className="table-cell-right">{customer.customer_lifetime_days}</td>
                    <td className="table-cell-right">{parseFloat(customer.purchase_frequency).toFixed(2)}</td>
                    <td className="table-cell">
                      {new Date(customer.first_purchase_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="table-cell">
                      {new Date(customer.last_purchase_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
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