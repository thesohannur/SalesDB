import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DailySalesChart() {
  const [salesData, setSalesData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");

  // Fetch daily sales based on selected year
  const fetchSalesData = async (year) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/daily-sales?year=${year}`
      );
      const data = await res.json();
      setSalesData(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch available years
  useEffect(() => {
    fetch("http://localhost:5000/api/daily-sales/years")
      .then((res) => res.json())
      .then((data) => setYears(data));
  }, []);


  useEffect(() => {
    fetchSalesData(selectedYear);
  }, [selectedYear]);

  return (
    <div style={{ width: "100%", height: 450 }}>

      <div style={{ marginBottom: "15px" }}>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{ padding: "6px" }}
        >
          <option value="all">All Years</option>
          {years.map((y) => (
            <option key={y.year} value={y.year}>
              {y.year}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer>
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sales_date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="total_sales_amount"
            stroke="#8884d8"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
