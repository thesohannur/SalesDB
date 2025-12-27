import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DailySalesChart() {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/daily-sales')
      .then(res => res.json())
      .then(data => setSalesData(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3>Daily Sales Trend</h3>
      <ResponsiveContainer>
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sales_date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total_sales_amount" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
