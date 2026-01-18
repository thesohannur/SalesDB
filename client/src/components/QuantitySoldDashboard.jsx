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

  const fetchData = async () => {
    let url = `/api/quantity-sold?type=${viewType}&year=${selectedYear}`;
    const res = await fetch(url);
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    setData([]);
  }, [viewType]);

  const fetchYears = async () => {
    const res = await fetch(`/api/quantity-sold/years`);
    const json = await res.json();
    setYears(json);
    if (json.length > 0 && !selectedYear) {
      setSelectedYear(json[0].toString());
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

  const renderCustomLabel = ({ name, percent }) => {
    if (percent >= 0.01) {
      return `${name} ${(percent * 100).toFixed(0)}%`;
    }
    return "";
  };

  const renderChart = () => {
    if (viewType === "product") {
      const sortedData = [...data].slice(0, 20);

      return (
        <div>
          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
            Top 20 Products by Quantity Sold
          </h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={sortedData}
              margin={{ bottom: 100, left: 10, right: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="product_name"
                angle={-45}
                textAnchor="end"
                height={150}
                interval={0}
                style={{ fontSize: "12px" }}
              />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="total_quantity_sold"
                fill="#8884d8"
                name="Quantity Sold"
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

      const top10Products = [...yearData]
        .slice(0, 10);

      return (
        <div>
          <div
            style={{
              marginBottom: "15px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <label
              htmlFor="category-year-select"
              style={{ fontSize: "16px", fontWeight: "bold" }}
            >
              Select Year:
            </label>
            <select
              id="category-year-select"
              value={selectedYear || ""}
              onChange={(e) => handleYearChange(e.target.value)}
              style={{
                padding: "8px 15px",
                fontSize: "14px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                cursor: "pointer",
                backgroundColor: "white",
              }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
            Top 10 Products in {selectedYear}
          </h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={top10Products}
              margin={{ bottom: 100, left: 10, right: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="product_name"
                angle={-45}
                textAnchor="end"
                height={150}
                interval={0}
                style={{ fontSize: "12px" }}
              />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="total_quantity_sold"
                fill="#82ca9d"
                name="Quantity Sold"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (viewType === "category") {
      return (
        <div>
          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
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
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <h4 style={{ margin: "0 0 10px 0" }}>Categories</h4>
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
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: COLORS[index % COLORS.length],
                        borderRadius: "3px",
                      }}
                    />
                    <span style={{ fontSize: "14px" }}>
                      {entry.category_name} ({percentage}%)
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

      // Get top 5 categories for selected year
      const top5Categories = [...data].slice(0, 10);

      return (
        <div>
          <div
            style={{
              marginBottom: "15px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <label
              htmlFor="category-year-select"
              style={{ fontSize: "16px", fontWeight: "bold" }}
            >
              Select Year:
            </label>
            <select
              id="category-year-select"
              value={selectedYear || ""}
              onChange={(e) => handleYearChange(e.target.value)}
              style={{
                padding: "8px 15px",
                fontSize: "14px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                cursor: "pointer",
                backgroundColor: "white",
              }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
            Top 10 Categories in {selectedYear}
          </h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={top5Categories}
              margin={{ bottom: 100, left: 10, right: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category_name"
                angle={-45}
                textAnchor="end"
                height={150}
                interval={0}
                style={{ fontSize: "12px" }}
              />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="total_quantity_sold"
                fill="#ffc658"
                name="Quantity Sold"
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

      {/* View Type Buttons */}
      <div
        style={{
          marginBottom: "15px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => handleViewChange("product")}
          style={{
            padding: "10px 15px",
            backgroundColor: viewType === "product" ? "#8884d8" : "#f0f0f0",
            color: viewType === "product" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Per Product
        </button>
        <button
          onClick={() => handleViewChange("year")}
          style={{
            padding: "10px 15px",
            backgroundColor: viewType === "year" ? "#8884d8" : "#f0f0f0",
            color: viewType === "year" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Per Year
        </button>
        <button
          onClick={() => handleViewChange("category")}
          style={{
            padding: "10px 15px",
            backgroundColor: viewType === "category" ? "#8884d8" : "#f0f0f0",
            color: viewType === "category" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Per Category
        </button>
        <button
          onClick={() => handleViewChange("category_year")}
          style={{
            padding: "10px 15px",
            backgroundColor:
              viewType === "category_year" ? "#8884d8" : "#f0f0f0",
            color: viewType === "category_year" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Per Category & Year
        </button>
      </div>

      {/* Year Buttons (without "All Years") */}
      {/* Removed - now using dropdowns in each chart */}

      {/* Render Chart */}
      {renderChart()}
    </div>
  );
}
