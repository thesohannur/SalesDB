import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#00C49F",
  "#a28bd4",
  "#ff6b9d",
];

export default function QuantitySoldDashboard() {
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [viewType, setViewType] = useState("product");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    let url = `/api/quantity-sold?type=${viewType}&year=${selectedYear}`;
    const res = await fetch(url);
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  useEffect(() => {
    setData([]);
  }, [viewType]);

  const fetchYears = async () => {
  try {
    const res = await fetch(`/api/quantity-sold/years`);
    
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
    if (json.length > 0 && !selectedYear) {
      setSelectedYear(json[0].toString());
    }
  } catch (err) {
    console.error("Failed to fetch years:", err);
    setYears([]);
  }
};

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    if (selectedYear !== null) {
      fetchData();
    }
  }, [viewType, selectedYear]);

  const handleViewChange = (type) => {
    setViewType(type);
    if (type === "year" || type === "category_year") {
      setSelectedYear(years.length > 0 ? years[0].toString() : "all");
    } else {
      setSelectedYear("all");
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  // Calculate dashboard statistics based on current view
  const calculateStats = () => {
    if (data.length === 0) return { totalQuantity: 0, totalItems: 0, avgQuantity: 0, topItem: "-" };
    
    const totalQuantity = data.reduce((sum, item) => sum + parseInt(item.total_quantity_sold || 0), 0);
    const totalItems = data.length;
    const avgQuantity = totalItems > 0 ? totalQuantity / totalItems : 0;
    const topItem = data[0]?.product_name || data[0]?.category_name || "-";
    
    return { totalQuantity, totalItems, avgQuantity, topItem };
  };

  const stats = calculateStats();

  const renderCustomLabel = ({ name, percent }) => {
    if (percent >= 0.01) {
      return `${name} ${(percent * 100).toFixed(0)}%`;
    }
    return "";
  };

  // Enhanced tooltip
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
            {data.product_name || data.category_name}
          </p>
          <p style={{ margin: '4px 0', color: '#8884d8', fontSize: '14px' }}>
            Quantity Sold: <strong>{data.total_quantity_sold?.toLocaleString()}</strong>
          </p>
          {data.sales_year && (
            <p style={{ margin: '4px 0', color: '#666', fontSize: '12px' }}>
              Year: {data.sales_year}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "60px", color: "#666", fontSize: "16px" }}>
          Loading data...
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "60px", color: "#666", fontSize: "16px" }}>
          No data available
        </div>
      );
    }

    if (viewType === "product") {
      const sortedData = [...data].slice(0, 20);

      return (
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#333", fontSize: "20px", fontWeight: "600" }}>
            Top 20 Products by Quantity Sold
          </h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={sortedData}
              margin={{ bottom: 100, left: 10, right: 10, top: 10 }}
            >
              <defs>
                <linearGradient id="colorProduct" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="product_name"
                angle={-45}
                textAnchor="end"
                height={150}
                interval={0}
                style={{ fontSize: "11px", fill: "#666" }}
              />
              <YAxis style={{ fontSize: "12px", fill: "#666" }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(136, 132, 216, 0.1)' }} />
              <Bar
                dataKey="total_quantity_sold"
                fill="url(#colorProduct)"
                name="Quantity Sold"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (viewType === "year") {
      const yearData =
        selectedYear === "all"
          ? data
          : data.filter(
              (d) =>
                d.sales_year !== undefined &&
                d.sales_year !== null &&
                d.sales_year.toString() === selectedYear.toString(),
            );

      const top10Products = [...yearData].slice(0, 10);

      return (
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <label
              htmlFor="category-year-select"
              style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}
            >
              Select Year:
            </label>
            <select
              id="category-year-select"
              value={selectedYear || ""}
              onChange={(e) => handleYearChange(e.target.value)}
              style={{
                padding: "10px 16px",
                fontSize: "14px",
                borderRadius: "8px",
                border: "2px solid #e0e0e0",
                cursor: "pointer",
                backgroundColor: "white",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#8884d8"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#333", fontSize: "20px", fontWeight: "600" }}>
            Top 10 Products in {selectedYear}
          </h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={top10Products}
              margin={{ bottom: 100, left: 10, right: 10, top: 10 }}
            >
              <defs>
                <linearGradient id="colorYear" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="product_name"
                angle={-45}
                textAnchor="end"
                height={150}
                interval={0}
                style={{ fontSize: "11px", fill: "#666" }}
              />
              <YAxis style={{ fontSize: "12px", fill: "#666" }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(130, 202, 157, 0.1)' }} />
              <Bar
                dataKey="total_quantity_sold"
                fill="url(#colorYear)"
                name="Quantity Sold"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (viewType === "category") {
      return (
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#333", fontSize: "20px", fontWeight: "600" }}>
            Quantity Sold by Category
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "40px",
            }}
          >
            <ResponsiveContainer width="65%" height={550}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="total_quantity_sold"
                  nameKey="category_name"
                  cx="50%"
                  cy="50%"
                  outerRadius={200}
                  label={renderCustomLabel}
                  labelLine={false}
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <h4 style={{ margin: "0 0 10px 0", color: "#333", fontSize: "18px", fontWeight: "600" }}>Categories</h4>
              {data.map((entry, index) => {
                const total = data.reduce(
                  (sum, item) => sum + item.total_quantity_sold,
                  0,
                );
                const percentage = (
                  (entry.total_quantity_sold / total) *
                  100
                ).toFixed(1);
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px",
                      borderRadius: "6px",
                      transition: "background-color 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        backgroundColor: COLORS[index % COLORS.length],
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    />
                    <span style={{ fontSize: "14px", color: "#333", fontWeight: "500" }}>
                      {entry.category_name}
                    </span>
                    <span style={{ fontSize: "13px", color: "#666", marginLeft: "auto" }}>
                      ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (viewType === "category_year") {
      if (!selectedYear) return <div>Loading...</div>;

      const top10Categories = [...data].slice(0, 10);

      return (
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <label
              htmlFor="category-year-select"
              style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}
            >
              Select Year:
            </label>
            <select
              id="category-year-select"
              value={selectedYear || ""}
              onChange={(e) => handleYearChange(e.target.value)}
              style={{
                padding: "10px 16px",
                fontSize: "14px",
                borderRadius: "8px",
                border: "2px solid #e0e0e0",
                cursor: "pointer",
                backgroundColor: "white",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#8884d8"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#333", fontSize: "20px", fontWeight: "600" }}>
            Top 10 Categories in {selectedYear}
          </h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={top10Categories}
              margin={{ bottom: 100, left: 10, right: 10, top: 10 }}
            >
              <defs>
                <linearGradient id="colorCategory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ffc658" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="category_name"
                angle={-45}
                textAnchor="end"
                height={150}
                interval={0}
                style={{ fontSize: "11px", fill: "#666" }}
              />
              <YAxis style={{ fontSize: "12px", fill: "#666" }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 198, 88, 0.1)' }} />
              <Bar
                dataKey="total_quantity_sold"
                fill="url(#colorCategory)"
                name="Quantity Sold"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      style={{
        width: "95%",
        margin: "20px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333", fontSize: "28px", fontWeight: "700" }}>
        Quantity Sold Dashboard
      </h2>

      {/* Summary Cards */}
      {!loading && data.length > 0 && (
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
            <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", opacity: 0.9, fontWeight: "500" }}>Total Quantity Sold</h4>
            <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
              {stats.totalQuantity.toLocaleString()}
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
              {viewType === "category" || viewType === "category_year" ? "Total Categories" : "Total Products"}
            </h4>
            <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
              {stats.totalItems.toLocaleString()}
            </p>
          </div>
          
          <div style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(79, 172, 254, 0.3)",
            color: "white",
          }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", opacity: 0.9, fontWeight: "500" }}>Average Quantity</h4>
            <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
              {Math.round(stats.avgQuantity).toLocaleString()}
            </p>
          </div>

          <div style={{
            background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(250, 112, 154, 0.3)",
            color: "white",
          }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", opacity: 0.9, fontWeight: "500" }}>Top Performer</h4>
            <p style={{ fontSize: "18px", fontWeight: "bold", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {stats.topItem}
            </p>
          </div>
        </div>
      )}

      {/* View Type Buttons */}
      <div
        style={{
          marginBottom: "25px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => handleViewChange("product")}
          style={{
            padding: "12px 24px",
            background: viewType === "product" 
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
              : "#f5f5f5",
            color: viewType === "product" ? "white" : "#333",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: viewType === "product" 
              ? "0 4px 12px rgba(102, 126, 234, 0.3)" 
              : "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease",
            transform: viewType === "product" ? "translateY(-2px)" : "none",
          }}
          onMouseEnter={(e) => {
            if (viewType !== "product") {
              e.target.style.backgroundColor = "#e8e8e8";
            }
          }}
          onMouseLeave={(e) => {
            if (viewType !== "product") {
              e.target.style.backgroundColor = "#f5f5f5";
            }
          }}
        >
          Per Product
        </button>
        <button
          onClick={() => handleViewChange("year")}
          style={{
            padding: "12px 24px",
            background: viewType === "year" 
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
              : "#f5f5f5",
            color: viewType === "year" ? "white" : "#333",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: viewType === "year" 
              ? "0 4px 12px rgba(102, 126, 234, 0.3)" 
              : "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease",
            transform: viewType === "year" ? "translateY(-2px)" : "none",
          }}
          onMouseEnter={(e) => {
            if (viewType !== "year") {
              e.target.style.backgroundColor = "#e8e8e8";
            }
          }}
          onMouseLeave={(e) => {
            if (viewType !== "year") {
              e.target.style.backgroundColor = "#f5f5f5";
            }
          }}
        >
          Per Year
        </button>
        <button
          onClick={() => handleViewChange("category")}
          style={{
            padding: "12px 24px",
            background: viewType === "category" 
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
              : "#f5f5f5",
            color: viewType === "category" ? "white" : "#333",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: viewType === "category" 
              ? "0 4px 12px rgba(102, 126, 234, 0.3)" 
              : "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease",
            transform: viewType === "category" ? "translateY(-2px)" : "none",
          }}
          onMouseEnter={(e) => {
            if (viewType !== "category") {
              e.target.style.backgroundColor = "#e8e8e8";
            }
          }}
          onMouseLeave={(e) => {
            if (viewType !== "category") {
              e.target.style.backgroundColor = "#f5f5f5";
            }
          }}
        >
          Per Category
        </button>
        <button
          onClick={() => handleViewChange("category_year")}
          style={{
            padding: "12px 24px",
            background: viewType === "category_year" 
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
              : "#f5f5f5",
            color: viewType === "category_year" ? "white" : "#333",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: viewType === "category_year" 
              ? "0 4px 12px rgba(102, 126, 234, 0.3)" 
              : "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease",
            transform: viewType === "category_year" ? "translateY(-2px)" : "none",
          }}
          onMouseEnter={(e) => {
            if (viewType !== "category_year") {
              e.target.style.backgroundColor = "#e8e8e8";
            }
          }}
          onMouseLeave={(e) => {
            if (viewType !== "category_year") {
              e.target.style.backgroundColor = "#f5f5f5";
            }
          }}
        >
          Per Category & Year
        </button>
      </div>

      {/* Render Chart */}
      {renderChart()}
    </div>
  );
}