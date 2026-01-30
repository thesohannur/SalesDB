import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  Area,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/DashboardStyles.css";

export default function ProductProfitMarginDashboard() {
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Color palette for profit margin segments
  const MARGIN_COLORS = {
    'High': '#10b981',      // Green for high margin (>30%)
    'Medium': '#f59e0b',    // Orange for medium margin (15-30%)
    'Low': '#ef4444',       // Red for low margin (<15%)
    'Negative': '#9ca3af'   // Gray for negative margin
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

  // Fetch Product Profit Margin data
  const fetchProductProfitMargin = async (year) => {
    try {
      setLoading(true);
      let url = `/api/profit-margin/product`;

      if (year !== "all") {
        url += `?year=${year}`;
      }

      const res = await fetch(url);

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
      console.error("Failed to fetch product profit margin:", err);
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
    fetchProductProfitMargin(selectedYear);
  }, [selectedYear]);

  // Helper function to determine margin category
  const getMarginCategory = (margin) => {
    if (margin < 0) return 'Negative';
    if (margin < 15) return 'Low';
    if (margin < 30) return 'Medium';
    return 'High';
  };

  // Get color based on profit margin
  const getMarginColor = (margin) => {
    return MARGIN_COLORS[getMarginCategory(margin)];
  };



  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{data.product_name}</p>
          <p className="tooltip-item" style={{ fontSize: '11px', color: '#666' }}>
            {data.category_name}
          </p>
          <p className="tooltip-item-blue">
            Revenue: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.total_revenue)}
          </p>
          <p className="tooltip-item-orange">
            Cost: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.total_cost)}
          </p>
          <p className="tooltip-item-green">
            Profit: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.total_profit)}
          </p>
          <p className="tooltip-item" style={{
            fontWeight: 'bold',
            color: getMarginColor(data.profit_margin_percentage)
          }}>
            Margin: {parseFloat(data.profit_margin_percentage).toFixed(2)}%
          </p>
          <p className="tooltip-item">
            Units Sold: <strong>{data.total_units_sold?.toLocaleString()}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label that shows outside the pie
  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
    if (percent < 0.01) return null; 
    
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#1f2937" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontSize: '13px', fontWeight: '600' }}
      >
        {`${name}: ${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  // Process data to group small categories as "Others"
  const processDataForPieChart = (data, valueKey) => {
    const total = data.reduce((sum, item) => sum + parseFloat(item[valueKey] || 0), 0);
    
    const mainCategories = [];
    let othersValue = 0;
    
    data.forEach(item => {
      const value = parseFloat(item[valueKey] || 0);
      const percentage = value / total;
      
      if (percentage >= 0) {
        mainCategories.push(item);
      } else {
        othersValue += value;
      }
    });
    
    // Add "Others" category if there are small slices
    if (othersValue > 0) {
      mainCategories.push({
        category_name: 'Others',
        [valueKey]: othersValue,
        total_revenue: valueKey === 'total_revenue' ? othersValue : 0,
        total_products_sold: valueKey === 'total_products_sold' ? othersValue : 0
      });
    }
    
    return mainCategories;
  };

  // Calculate summary statistics
  const calculateStats = () => {
    if (data.length === 0) return {
      totalRevenue: 0,
      totalCost: 0,
      totalProfit: 0,
      avgMargin: 0,
      highestMargin: 0,
      lowestMargin: 0,
      profitableProducts: 0,
      totalUnitsSold: 0
    };

    const totalRevenue = data.reduce((sum, item) => sum + parseFloat(item.total_revenue || 0), 0);
    const totalCost = data.reduce((sum, item) => sum + parseFloat(item.total_cost || 0), 0);
    const totalProfit = data.reduce((sum, item) => sum + parseFloat(item.total_profit || 0), 0);
    const totalUnitsSold = data.reduce((sum, item) => sum + parseInt(item.total_units_sold || 0), 0);

    const margins = data.map(item => parseFloat(item.profit_margin_percentage));
    const avgMargin = margins.length > 0
      ? margins.reduce((sum, val) => sum + val, 0) / margins.length
      : 0;

    const highestMargin = margins.length > 0 ? Math.max(...margins) : 0;
    const lowestMargin = margins.length > 0 ? Math.min(...margins) : 0;

    const profitableProducts = data.filter(item => parseFloat(item.total_profit) > 0).length;

    return {
      totalRevenue,
      totalCost,
      totalProfit,
      avgMargin,
      highestMargin,
      lowestMargin,
      profitableProducts,
      totalUnitsSold
    };
  };

  const stats = calculateStats();

  // Get top performers (top 15)
  const topPerformers = data.slice(0, 15);

  // Prepare data for profit margin distribution
  const getMarginDistribution = () => {
    const distribution = { 'High': 0, 'Medium': 0, 'Low': 0, 'Negative': 0 };
    data.forEach(item => {
      const category = getMarginCategory(parseFloat(item.profit_margin_percentage));
      distribution[category]++;
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  };

  const marginDistribution = getMarginDistribution();

  // Prepare profit vs revenue scatter data (sample of top 50 for readability)
  const scatterData = data.slice(0, 50);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Product Profit Margin Dashboard</h2>

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
        Product Profit Analysis - {selectedYear === "all" ? "All Time" : selectedYear}
      </h3>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">Loading product profit margin data...</div>
      ) : data.length === 0 ? (
        <div className="empty-state">No data available for the selected year</div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card summary-card-purple">
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

            <div className="summary-card summary-card-pink">
              <h4 className="card-title">Total Profit</h4>
              <p className="card-value">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(stats.totalProfit)}
              </p>
            </div>

            <div className="summary-card summary-card-blue">
              <h4 className="card-title">Avg Profit Margin</h4>
              <p className="card-value" >
                {stats.avgMargin.toFixed(2)}%
              </p>
            </div>

            <div className="summary-card summary-card-orange">
              <h4 className="card-title">Profitable Products</h4>
              <p className="card-value">{stats.profitableProducts}</p>
            </div>
          </div>

          {/* Top Performers by Profit Margin */}
          <div className="chart-container">
            <h4 className="section-title">Top 15 Products by Profit Margin %</h4>
            <ResponsiveContainer width="100%" height={Math.max(500, topPerformers.length * 35)}>
              <BarChart
                layout="vertical"
                data={topPerformers}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  tickFormatter={(value) => `${value.toFixed(1)}%`}
                  style={{ fontSize: "12px", fill: "#666" }}
                />
                <YAxis
                  type="category"
                  dataKey="product_name"
                  width={150}
                  interval={0}
                  style={{ fontSize: "11px", fill: "#666" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="profit_margin_percentage"
                  name="Profit Margin %"
                  radius={[0, 6, 6, 0]}
                >
                  {topPerformers.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getMarginColor(parseFloat(entry.profit_margin_percentage))}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue vs Profit vs Cost */}
          <div className="chart-container">
            <h4 className="section-title">Revenue, Cost & Profit Comparison (Top 15)</h4>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart
                data={topPerformers}
                margin={{ top: 10, right: 30, left: 10, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="product_name"
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  style={{ fontSize: "10px", fill: "#6b7280" }}
                />
                <YAxis
                  tickFormatter={(value) => {
                    if (value >= 1_000_000) return "$" + (value / 1_000_000).toFixed(1) + "M";
                    if (value >= 1_000) return "$" + (value / 1_000).toFixed(1) + "K";
                    return "$" + value;
                  }}
                  style={{ fontSize: "12px", fill: "#6b7280" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="total_revenue" fill="#8b5cf6" name="Revenue" radius={[6, 6, 0, 0]} />
                <Bar dataKey="total_cost" fill="#ef4444" name="Cost" radius={[6, 6, 0, 0]} />
                <Bar dataKey="total_profit" fill="#10b981" name="Profit" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Charts Grid */}
          <div className="chart-grid">
            {/* Profit Margin Distribution */}
            <div className="chart-card">
              <h4 className="section-title">Profit Margin Distribution</h4>
              <ResponsiveContainer width="100%" height={600}> {/* Bigger height */}
                <PieChart>
                  <Pie
                    data={processDataForPieChart(marginDistribution, 'value')} // Group small slices
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={180}
                    label={renderCustomLabel} 
                    labelLine={true}
                  >
                    {processDataForPieChart(marginDistribution, 'value').map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.name === 'Others' ? '#9ca3af' : MARGIN_COLORS[entry.name]} // Gray for Others
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>


            {/* Profit vs Revenue Scatter */}
            <div className="chart-card">
              <h4 className="section-title">Profit vs Revenue (Top 50)</h4>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="total_revenue"
                    name="Revenue"
                    tickFormatter={(value) => {
                      if (value >= 1_000_000) return "$" + (value / 1_000_000).toFixed(1) + "M";
                      if (value >= 1_000) return "$" + (value / 1_000).toFixed(1) + "K";
                      return "$" + value;
                    }}
                    label={{ value: 'Revenue', position: 'bottom', offset: 40 }}
                    style={{ fontSize: "11px" }}
                  />
                  <YAxis
                    type="number"
                    dataKey="total_profit"
                    name="Profit"
                    tickFormatter={(value) => {
                      if (value >= 1_000_000) return "$" + (value / 1_000_000).toFixed(1) + "M";
                      if (value >= 1_000) return "$" + (value / 1_000).toFixed(1) + "K";
                      return "$" + value;
                    }}
                    label={{ value: 'Profit', angle: -90, position: 'insideLeft' }}
                    style={{ fontSize: "11px" }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={scatterData} fill="#667eea" shape="circle">
                    {scatterData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getMarginColor(parseFloat(entry.profit_margin_percentage))}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average Metrics */}
          <div className="chart-container">
            <h4 className="section-title">Average Price & Cost Analysis (Top 15)</h4>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={topPerformers}
                margin={{ top: 10, right: 30, left: 10, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="product_name"
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  style={{ fontSize: "10px", fill: "#6b7280" }}
                />
                <YAxis
                  tickFormatter={(value) => {
                    if (value >= 1_000) return "$" + (value / 1_000).toFixed(1) + "K";
                    return "$" + value;
                  }}
                  style={{ fontSize: "12px", fill: "#6b7280" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="avg_selling_price" fill="#667eea" name="Avg Selling Price" radius={[6, 6, 0, 0]} />
                <Bar dataKey="avg_cost_price" fill="#f59e0b" name="Avg Cost (COGS)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="avg_profit_per_unit" fill="#10b981" name="Avg Profit/Unit" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Profit Margin Trend Line Chart */}
          <div className="chart-container">
            <h4 className="section-title">Profit Margin Trend (Top 20)</h4>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={data.slice(0, 20)}
                margin={{ top: 10, right: 30, left: 10, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="product_name"
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  style={{ fontSize: "10px", fill: "#6b7280" }}
                />
                <YAxis
                  tickFormatter={(value) => `${value}%`}
                  style={{ fontSize: "12px", fill: "#6b7280" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="profit_margin_percentage"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#8b5cf6" }}
                  activeDot={{ r: 7 }}
                  name="Profit Margin %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div className="table-container">
            <h4 className="section-title">Detailed Product Breakdown</h4>
            <table className="data-table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Rank</th>
                  <th className="table-header-cell">Product Name</th>
                  <th className="table-header-cell">Category</th>
                  <th className="table-header-cell-right">Revenue</th>
                  <th className="table-header-cell-right">Cost</th>
                  <th className="table-header-cell-right">Profit</th>
                  <th className="table-header-cell-right">Margin %</th>
                  <th className="table-header-cell-right">Units Sold</th>
                  <th className="table-header-cell-right">Avg Price</th>
                  <th className="table-header-cell-right">Avg Profit/Unit</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell">{index + 1}</td>
                    <td className="table-cell-bold">{item.product_name}</td>
                    <td className="table-cell">{item.category_name}</td>
                    <td className="table-cell-blue">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.total_revenue)}
                    </td>
                    <td className="table-cell-right">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.total_cost)}
                    </td>
                    <td className="table-cell-green">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.total_profit)}
                    </td>
                    <td className="table-cell-right" style={{
                      fontWeight: 'bold',
                      color: getMarginColor(parseFloat(item.profit_margin_percentage))
                    }}>
                      {parseFloat(item.profit_margin_percentage).toFixed(2)}%
                    </td>
                    <td className="table-cell-right">
                      {item.total_units_sold?.toLocaleString()}
                    </td>
                    <td className="table-cell-right">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.avg_selling_price)}
                    </td>
                    <td className="table-cell-right">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.avg_profit_per_unit)}
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
