import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function RevenuePerCategoryDashboard() {
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [loading, setLoading] = useState(true);

  // Color palette for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

  // Fetch available years
  const fetchYears = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/quantity-sold/years');
    
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

  // Fetch revenue per category data
  const fetchRevenuePerCategory = async (year) => {
    try {
      setLoading(true);
      let url = `/api/revenue-per-category`;
      
      if (year !== "all") {
        url += `?year=${year}`;
      }

      const res = await fetch(url);
      const json = await res.json();
      
      if (Array.isArray(json)) {
        setData(json);
      } else {
        console.error("Expected array but got:", json);
        setData([]);
      }
    } catch (err) {
      console.error("Failed to fetch revenue per category:", err);
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
    fetchRevenuePerCategory(selectedYear);
  }, [selectedYear]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].payload.category_name}</p>
          <p style={{ margin: '5px 0 0 0', color: '#8884d8' }}>
            Revenue: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(payload[0].value)}
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#82ca9d' }}>
            Products Sold: {payload[0].payload.total_products_sold?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontSize: '12px', fontWeight: 'bold' }}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div style={{ width: "95%", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Revenue Per Category Dashboard
      </h2>

      {/* Year Selection Dropdown */}
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <label htmlFor="year-select" style={{ fontSize: "16px", fontWeight: "bold" }}>
          Select Year:
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{ 
            padding: "8px 15px",
            fontSize: "14px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            cursor: "pointer",
            backgroundColor: "white"
          }}
        >
          <option value="all">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#555" }}>
        {selectedYear === "all" ? "All Time Performance" : `Performance in ${selectedYear}`}
      </h3>

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          Loading category data...
        </div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          No data available for the selected year
        </div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
            gap: "20px", 
            marginBottom: "30px" 
          }}>
            <div style={{
              backgroundColor: "#f0f9ff",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #bae6fd"
            }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#0369a1" }}>Total Categories</h4>
              <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0, color: "#0c4a6e" }}>
                {data.length}
              </p>
            </div>
            
            <div style={{
              backgroundColor: "#f0fdf4",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #bbf7d0"
            }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#15803d" }}>Total Revenue</h4>
              <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0, color: "#14532d" }}>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(data.reduce((sum, item) => sum + parseFloat(item.total_revenue || 0), 0))}
              </p>
            </div>
            
            <div style={{
              backgroundColor: "#fef3c7",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #fde68a"
            }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#92400e" }}>Total Products Sold</h4>
              <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0, color: "#78350f" }}>
                {data.reduce((sum, item) => sum + parseInt(item.total_products_sold || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "30px", 
            marginBottom: "40px" 
          }}>
            {/* Revenue Pie Chart */}
            <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <h4 style={{ textAlign: "center", marginBottom: "15px" }}>Revenue Distribution</h4>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="total_revenue"
                    nameKey="category_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={renderCustomLabel}
                    labelLine={false}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Products Sold Pie Chart */}
            <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <h4 style={{ textAlign: "center", marginBottom: "15px" }}>Products Sold Distribution</h4>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="total_products_sold"
                    nameKey="category_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={renderCustomLabel}
                    labelLine={false}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Bar Chart */}
          <div style={{ marginBottom: "40px" }}>
            <h4 style={{ textAlign: "center", marginBottom: "15px" }}>Revenue by Category</h4>
            <ResponsiveContainer width="100%" height={Math.max(400, data.length * 50)}>
              <BarChart
                layout="vertical"
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={(value) => {
                    if (value >= 1_000_000) return "$" + (value / 1_000_000).toFixed(1) + "M";
                    if (value >= 1_000) return "$" + (value / 1_000).toFixed(1) + "K";
                    return "$" + value;
                  }}
                />
                <YAxis 
                  type="category" 
                  dataKey="category_name" 
                  width={150}
                  interval={0}
                  style={{ fontSize: "12px" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total_revenue" fill="#8884d8" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Products Sold Bar Chart */}
          <div style={{ marginBottom: "40px" }}>
            <h4 style={{ textAlign: "center", marginBottom: "15px" }}>Products Sold by Category</h4>
            <ResponsiveContainer width="100%" height={Math.max(400, data.length * 50)}>
              <BarChart
                layout="vertical"
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <YAxis 
                  type="category" 
                  dataKey="category_name" 
                  width={150}
                  interval={0}
                  style={{ fontSize: "12px" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total_products_sold" fill="#82ca9d" name="Products Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div style={{ marginTop: "40px", overflowX: "auto" }}>
            <h4 style={{ textAlign: "center", marginBottom: "15px" }}>Detailed Breakdown</h4>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#f3f4f6" }}>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>Rank</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>Category Name</th>
                  <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #e5e7eb" }}>Revenue</th>
                  <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #e5e7eb" }}>Products Sold</th>
                  <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #e5e7eb" }}>Avg Revenue/Product</th>
                  <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #e5e7eb" }}>Revenue Share</th>
                </tr>
              </thead>
              <tbody>
                {data.map((category, index) => {
                  const avgRevenue = category.total_products_sold > 0 
                    ? parseFloat(category.total_revenue) / parseInt(category.total_products_sold)
                    : 0;
                  
                  const totalRevenue = data.reduce((sum, item) => sum + parseFloat(item.total_revenue || 0), 0);
                  const revenueShare = totalRevenue > 0 
                    ? (parseFloat(category.total_revenue) / totalRevenue) * 100 
                    : 0;
                  
                  return (
                    <tr key={index} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "12px" }}>{index + 1}</td>
                      <td style={{ padding: "12px", fontWeight: "500" }}>{category.category_name}</td>
                      <td style={{ padding: "12px", textAlign: "right", color: "#059669" }}>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(category.total_revenue)}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        {parseInt(category.total_products_sold).toLocaleString()}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right", color: "#6366f1" }}>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(avgRevenue)}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right", color: "#dc2626" }}>
                        {revenueShare.toFixed(1)}%
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