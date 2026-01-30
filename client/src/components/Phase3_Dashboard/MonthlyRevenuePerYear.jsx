import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


export default function MonthlyRevenueDashboard() {
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  // Fetch monthly revenue data
  const fetchMonthlyRevenue = async (year) => {
    try {
      setLoading(true);
      let url = `/api/monthly-revenue`;
      
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
      console.error("Failed to fetch monthly revenue:", err);
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
    fetchMonthlyRevenue(selectedYear);
  }, [selectedYear]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            {data.month_name} {data.sales_year}
          </p>
          <p style={{ margin: '4px 0', color: '#8884d8', fontSize: '14px' }}>
            Revenue: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.total_revenue)}
          </p>
          <p style={{ margin: '4px 0', color: '#82ca9d', fontSize: '14px' }}>
            Orders: <strong>{data.total_orders?.toLocaleString()}</strong>
          </p>
          <p style={{ margin: '4px 0', color: '#ffc658', fontSize: '14px' }}>
            Products Sold: <strong>{data.total_products_sold?.toLocaleString()}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate summary statistics
  const calculateStats = () => {
    if (data.length === 0) return { 
      totalRevenue: 0, 
      totalOrders: 0, 
      totalProducts: 0, 
      avgMonthlyRevenue: 0,
      bestMonth: "-" 
    };
    
    const totalRevenue = data.reduce((sum, item) => sum + parseFloat(item.total_revenue || 0), 0);
    const totalOrders = data.reduce((sum, item) => sum + parseInt(item.total_orders || 0), 0);
    const totalProducts = data.reduce((sum, item) => sum + parseInt(item.total_products_sold || 0), 0);
    const avgMonthlyRevenue = data.length > 0 ? totalRevenue / data.length : 0;
    
    // Find best performing month
    const bestMonthData = data.reduce((max, item) => 
      parseFloat(item.total_revenue) > parseFloat(max.total_revenue || 0) ? item : max
    , { total_revenue: 0 });
    
    const bestMonth = bestMonthData.month_name 
      ? `${bestMonthData.month_name.trim()} ${bestMonthData.sales_year}` 
      : "-";
    
    return { totalRevenue, totalOrders, totalProducts, avgMonthlyRevenue, bestMonth };
  };

  const stats = calculateStats();

  // Format month name for display
  const formatMonthLabel = (monthName, monthNumber) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNumber - 1] || monthName;
  };

  return (
    <div style={{ width: "95%", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      
      
      <h2 className="dashboard-heading">
        Monthly Revenue Dashboard
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

     <h3 className="performance-heading">
        {selectedYear === "all" ? "All Time Performance" : `Performance in ${selectedYear}`}
      </h3>

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          Loading monthly revenue data...
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
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
            gap: "20px", 
            marginBottom: "30px" 
          }}>
            <div style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
              color: "white",
            }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", opacity: 0.9, fontWeight: "500" }}>
                Total Revenue
              </h4>
              <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(stats.totalRevenue)}
              </p>
            </div>
            
            <div style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(240, 147, 251, 0.3)",
              color: "white",
            }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", opacity: 0.9, fontWeight: "500" }}>
                Total Orders
              </h4>
              <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
                {stats.totalOrders.toLocaleString()}
              </p>
            </div>
            
            <div style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(79, 172, 254, 0.3)",
              color: "white",
            }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", opacity: 0.9, fontWeight: "500" }}>
                Avg Monthly Revenue
              </h4>
              <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(stats.avgMonthlyRevenue)}
              </p>
            </div>

            <div style={{
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(250, 112, 154, 0.3)",
              color: "white",
            }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", opacity: 0.9, fontWeight: "500" }}>
                Best Month
              </h4>
              <p style={{ fontSize: "18px", fontWeight: "bold", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {stats.bestMonth}
              </p>
            </div>
          </div>

          {/* Revenue Line Chart */}
          <div style={{ 
            marginBottom: "40px", 
            backgroundColor: "white", 
            padding: "25px", 
            borderRadius: "12px", 
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)" 
          }}>
            <h4 style={{ textAlign: "center", marginBottom: "20px", color: "#333", fontSize: "20px", fontWeight: "600" }}>
              Monthly Revenue Trend
            </h4>
            <ResponsiveContainer width="100%" height={450}>
              <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 60 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="sales_month"
                  tickFormatter={(month) => formatMonthLabel(null, month)}
                  style={{ fontSize: "12px", fill: "#666" }}
                />
                <YAxis 
                  tickFormatter={(value) => {
                    if (value >= 1_000_000) return "$" + (value / 1_000_000).toFixed(1) + "M";
                    if (value >= 1_000) return "$" + (value / 1_000).toFixed(1) + "K";
                    return "$" + value;
                  }}
                  style={{ fontSize: "12px", fill: "#666" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total_revenue" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#667eea" }}
                  activeDot={{ r: 7 }}
                  fill="url(#colorRevenue)"
                  name="Monthly Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders and Products Charts */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "20px", 
            marginBottom: "40px" 
          }}>
            {/* Monthly Orders Chart */}
            <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <h4 style={{ textAlign: "center", marginBottom: "20px", color: "#333", fontSize: "18px", fontWeight: "600" }}>
                Monthly Orders
              </h4>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0.85}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="sales_month" 
                    tickFormatter={(month) => formatMonthLabel(null, month)}
                    style={{ fontSize: "11px", fill: "#6b7280" }}
                  />
                  <YAxis style={{ fontSize: "12px", fill: "#6b7280" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="total_orders" 
                    fill="url(#colorOrders)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Products Sold Chart */}
            <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <h4 style={{ textAlign: "center", marginBottom: "20px", color: "#333", fontSize: "18px", fontWeight: "600" }}>
                Products Sold
              </h4>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                  <defs>
                    <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.85}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="sales_month" 
                    tickFormatter={(month) => formatMonthLabel(null, month)}
                    style={{ fontSize: "11px", fill: "#6b7280" }}
                  />
                  <YAxis style={{ fontSize: "12px", fill: "#6b7280" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="total_products_sold" 
                    fill="url(#colorProducts)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table */}
          <div style={{ marginTop: "40px", overflowX: "auto" }}>
            <h4 style={{ textAlign: "center", marginBottom: "15px" }}>Detailed Monthly Breakdown</h4>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#f3f4f6" }}>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>Month</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>Year</th>
                  <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #e5e7eb" }}>Revenue</th>
                  <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #e5e7eb" }}>Orders</th>
                  <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #e5e7eb" }}>Products Sold</th>
                  <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #e5e7eb" }}>Avg Order Value</th>
                </tr>
              </thead>
              <tbody>
                {data.map((month, index) => {
                  const avgOrderValue = month.total_orders > 0 
                    ? parseFloat(month.total_revenue) / parseInt(month.total_orders)
                    : 0;
                  
                  return (
                    <tr key={index} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "12px", fontWeight: "500" }}>{month.month_name}</td>
                      <td style={{ padding: "12px" }}>{month.sales_year}</td>
                      <td style={{ padding: "12px", textAlign: "right", color: "#059669" }}>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(month.total_revenue)}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        {parseInt(month.total_orders).toLocaleString()}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        {parseInt(month.total_products_sold).toLocaleString()}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right", color: "#6366f1" }}>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(avgOrderValue)}
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