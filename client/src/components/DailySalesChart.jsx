import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function DailySalesDashboard() {
  const [salesData, setSalesData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch available years
  const fetchYears = async () => {
    try {
      const res = await fetch("/api/daily-sales/years");
      const json = await res.json();
      setYears(json);
    } catch (err) {
      console.error("Failed to fetch years:", err);
    }
  };

  // Fetch daily sales based on selected year
  const fetchSalesData = async (year) => {
    try {
      setLoading(true);
      let url = `/api/daily-sales`;

      if (year !== "all") {
        url += `?year=${year}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (Array.isArray(json)) {
        setSalesData(json);
      } else {
        console.error("Expected array but got:", json);
        setSalesData([]);
      }
    } catch (err) {
      console.error("Failed to fetch sales data:", err);
      setSalesData([]);
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
    fetchSalesData(selectedYear);
  }, [selectedYear]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold", marginBottom: "8px" }}>
            {new Date(data.sales_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p style={{ margin: "4px 0", color: "#8884d8" }}>
            Sales:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.total_sales_amount)}
          </p>
          <p style={{ margin: "4px 0", color: "#82ca9d" }}>
            Orders: {data.total_orders?.toLocaleString()}
          </p>
          <p style={{ margin: "4px 0", color: "#ffc658" }}>
            Items Sold: {data.total_quantity_sold?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate summary statistics
  const calculateStats = () => {
    if (salesData.length === 0)
      return { totalSales: 0, totalOrders: 0, totalItems: 0, avgDailySales: 0 };

    const totalSales = salesData.reduce(
      (sum, item) => sum + parseFloat(item.total_sales_amount || 0),
      0,
    );
    const totalOrders = salesData.reduce(
      (sum, item) => sum + parseInt(item.total_orders || 0),
      0,
    );
    const totalItems = salesData.reduce(
      (sum, item) => sum + parseInt(item.total_quantity_sold || 0),
      0,
    );
    const avgDailySales =
      salesData.length > 0 ? totalSales / salesData.length : 0;

    return { totalSales, totalOrders, totalItems, avgDailySales };
  };

  const stats = calculateStats();

  return (
    <div
      style={{
        width: "95%",
        margin: "20px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Daily Sales Dashboard
      </h2>

      {/* Year Selection Dropdown */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <label
          htmlFor="year-select"
          style={{ fontSize: "16px", fontWeight: "bold" }}
        >
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
            backgroundColor: "white",
          }}
        >
          <option value="all">All Years</option>
          {years.map((y) => (
            <option key={y.year} value={y.year}>
              {y.year}
            </option>
          ))}
        </select>
      </div>

      <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#555" }}>
        {selectedYear === "all"
          ? "All Time Performance"
          : `Performance in ${selectedYear}`}
      </h3>

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          Loading sales data...
        </div>
      ) : salesData.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          No data available for the selected year
        </div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                backgroundColor: "#f0fdf4",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #bbf7d0",
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", color: "#15803d" }}>
                Total Sales
              </h4>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  margin: 0,
                  color: "#14532d",
                }}
              >
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(stats.totalSales)}
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#f0f9ff",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #bae6fd",
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", color: "#0369a1" }}>
                Total Orders
              </h4>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  margin: 0,
                  color: "#0c4a6e",
                }}
              >
                {stats.totalOrders.toLocaleString()}
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#fef3c7",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #fde68a",
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", color: "#92400e" }}>
                Items Sold
              </h4>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  margin: 0,
                  color: "#78350f",
                }}
              >
                {stats.totalItems.toLocaleString()}
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#fce7f3",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #fbcfe8",
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", color: "#9f1239" }}>
                Avg Daily Sales
              </h4>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  margin: 0,
                  color: "#881337",
                }}
              >
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(stats.avgDailySales)}
              </p>
            </div>
          </div>

          {/* Sales Trend Line Chart */}
          <div
            style={{
              marginBottom: "40px",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h4 style={{ textAlign: "center", marginBottom: "15px" }}>
              Daily Sales Trend
            </h4>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={salesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="sales_date"
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tickFormatter={(value) => {
                    if (value >= 1_000_000)
                      return "$" + (value / 1_000_000).toFixed(1) + "M";
                    if (value >= 1_000)
                      return "$" + (value / 1_000).toFixed(1) + "K";
                    return "$" + value;
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total_sales_amount"
                  stroke="#00bbff"
                  strokeWidth={1}
                  dot={{ r: 3 }}
                  name="Sales Amount"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

         {/* Orders and Items Chart */}
<div style={{ 
  marginBottom: "40px", 
  backgroundColor: "white", 
  padding: "20px", 
  borderRadius: "12px", 
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)" 
}}>
  <h4 style={{ 
    textAlign: "center", 
    marginBottom: "15px", 
    fontWeight: "600", 
    color: "#333",
    fontSize: "18px"
  }}>
    Daily Orders & Items Sold
  </h4>
  <ResponsiveContainer width="100%" height={500}>
    <BarChart 
      data={salesData} 
      margin={{ top: 5, right: 20, left: 5, bottom: 60 }}
      barSize={30}
      barGap={5}
    >
      {/* Cleaner grid lines */}
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
      
      {/* X Axis */}
      <XAxis 
        dataKey="sales_date" 
        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })}
        angle={-45}
        textAnchor="end"
        height={70}
        stroke="#d1d5db"
        tick={{ fontSize: 11, fill: "#6b7280" }}
      />
      
      {/* Y Axis */}
      <YAxis 
        stroke="#d1d5db" 
        tick={{ fontSize: 12, fill: "#6b7280" }} 
      />
      
      {/* Tooltip */}
      <Tooltip 
        contentStyle={{ 
          backgroundColor: "white", 
          borderRadius: "8px", 
          border: "1px solid #e5e7eb", 
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)" 
        }}
        itemStyle={{ fontWeight: "500" }}
      />
      
      {/* Legend */}
      <Legend 
        wrapperStyle={{ 
          fontWeight: "600", 
          paddingTop: "10px" 
        }} 
      />
      
      {/* Solid, vibrant gradients for better visibility */}
      <defs>
        <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
          <stop offset="100%" stopColor="#34d399" stopOpacity={0.9}/>
        </linearGradient>
        <linearGradient id="itemsGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
          <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.9}/>
        </linearGradient>
      </defs>
      
      <Bar 
        dataKey="total_orders" 
        fill="url(#ordersGradient)" 
        name="Total Orders" 
        radius={[6, 6, 0, 0]}
      />
      <Bar 
        dataKey="total_quantity_sold" 
        fill="url(#itemsGradient)" 
        name="Items Sold" 
        radius={[6, 6, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
</div>

          {/* Data Table */}
          <div style={{ marginTop: "40px", overflowX: "auto" }}>
            <h4 style={{ textAlign: "center", marginBottom: "15px" }}>
              Detailed Daily Breakdown
            </h4>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f3f4f6" }}>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    Sales Amount
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    Total Orders
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    Items Sold
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    Avg Order Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((day, index) => {
                  const avgOrderValue =
                    day.total_orders > 0
                      ? parseFloat(day.total_sales_amount) /
                        parseInt(day.total_orders)
                      : 0;

                  return (
                    <tr
                      key={index}
                      style={{ borderBottom: "1px solid #e5e7eb" }}
                    >
                      <td style={{ padding: "12px", fontWeight: "500" }}>
                        {new Date(day.sales_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          color: "#059669",
                        }}
                      >
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(day.total_sales_amount)}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        {parseInt(day.total_orders).toLocaleString()}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        {parseInt(day.total_quantity_sold).toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          color: "#6366f1",
                        }}
                      >
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
