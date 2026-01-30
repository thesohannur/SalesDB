import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./styles/DashboardStyles.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenuePerProductDashboard() {
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch available years
  const fetchYears = async () => {
    try {
      const res = await fetch("/api/quantity-sold/years");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const text = await res.text();
      if (!text || text.trim() === "") {
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

  // Fetch revenue data based on selected year
  const fetchRevenue = async (year) => {
    try {
      setLoading(true);
      let url = "";

      if (year === "all") {
        url = "/api/totalrevenue";
      } else {
        url = `/api/revenue-per-product?year=${year}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (Array.isArray(json)) {
        if (year !== "all") {
          const filteredData = json.filter(
            (item) =>
              item.sales_year && item.sales_year.toString() === year.toString(),
          );
          setData(filteredData);
        } else {
          setData(json);
        }
      } else {
        console.error("Expected array but got:", json);
        setData([]);
      }
    } catch (err) {
      console.error("Failed to fetch revenue:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch years on component mount
  useEffect(() => {
    fetchYears();
  }, []);

  // Fetch revenue data whenever selectedYear changes
  useEffect(() => {
    fetchRevenue(selectedYear);
  }, [selectedYear]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>
            {payload[0].payload.product_name}
          </p>
          <p style={{ margin: "5px 0 0 0", color: "#8884d8" }}>
            Revenue:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(payload[0].value)}
          </p>
          {payload[0].payload.sales_year && (
            <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "12px" }}>
              Year: {payload[0].payload.sales_year}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate summary statistics
  const calculateStats = () => {
    if (data.length === 0)
      return {
        totalRevenue: 0,
        totalProducts: 0,
        avgRevenue: 0,
        topProduct: "-",
      };

    const totalRevenue = data.reduce(
      (sum, item) => sum + parseFloat(item.total_revenue || 0),
      0,
    );
    const totalProducts = data.length;
    const avgRevenue = totalProducts > 0 ? totalRevenue / totalProducts : 0;
    const topProduct = data[0]?.product_name || "-";

    return { totalRevenue, totalProducts, avgRevenue, topProduct };
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
     
      <h2 className="dashboard-heading">
        Revenue Per Product Dashboard
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
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <h3 className="performance-heading">
        {selectedYear === "all"
          ? "All Time Performance"
          : `Performance in ${selectedYear}`}
      </h3>

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          Loading revenue data...
        </div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          No data available for the selected year
        </div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card summary-card-purple">
              <h4 className="card-title">
                Total Revenue
              </h4>
               <p className="card-value">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(stats.totalRevenue)}
              </p>
            </div>

           <div className="summary-card summary-card-pink">
              <h4 className="card-title">
                Total Products
              </h4>
               <p className="card-value">
                {stats.totalProducts}
              </p>
            </div>

            <div className="summary-card summary-card-blue">
              <h4 className="card-title">
                Average Revenue/Product
              </h4>
              <p className="card-value">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(stats.avgRevenue)}
              </p>
            </div>

           <div className="summary-card summary-card-orange">
              <h4 className="card-title">
                Top Product
              </h4>
              <p className="card-value-small">
                {stats.topProduct}
              </p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div style={{ marginBottom: "40px" }}>
            <h4 style={{ textAlign: "center", marginBottom: "15px" }}>
              Revenue by Product
            </h4>
            <ResponsiveContainer
              width="100%"
              height={Math.max(500, data.length * 30)}
            >
              <BarChart
                layout="vertical"
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={(value) => {
                    if (value >= 1_000_000)
                      return "$" + (value / 1_000_000).toFixed(1) + "M";
                    if (value >= 1_000)
                      return "$" + (value / 1_000).toFixed(1) + "K";
                    return "$" + value;
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="product_name"
                  width={190}
                  interval={0}
                  style={{ fontSize: "11px" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total_revenue" fill="#8884d8" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div style={{ marginTop: "40px", overflowX: "auto" }}>
            <h4 style={{ textAlign: "center", marginBottom: "15px" }}>
              Detailed Breakdown
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
                    Rank
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    Product Name
                  </th>
                  {selectedYear !== "all" && (
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        borderBottom: "2px solid #e5e7eb",
                      }}
                    >
                      Year
                    </th>
                  )}
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    Total Revenue
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    Revenue Share
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((product, index) => {
                  const revenueShare =
                    stats.totalRevenue > 0
                      ? (parseFloat(product.total_revenue) /
                          stats.totalRevenue) *
                        100
                      : 0;

                  return (
                    <tr
                      key={index}
                      style={{ borderBottom: "1px solid #e5e7eb" }}
                    >
                      <td style={{ padding: "12px" }}>{index + 1}</td>
                      <td style={{ padding: "12px", fontWeight: "500" }}>
                        {product.product_name}
                      </td>
                      {selectedYear !== "all" && (
                        <td
                          style={{
                            padding: "12px",
                            textAlign: "center",
                            color: "#6b7280",
                          }}
                        >
                          {product.sales_year || "-"}
                        </td>
                      )}
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
                        }).format(product.total_revenue)}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          color: "#dc2626",
                        }}
                      >
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
