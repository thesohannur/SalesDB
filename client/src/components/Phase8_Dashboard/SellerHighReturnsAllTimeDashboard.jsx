import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from "recharts";
import "../styles/DashboardStyles.css";

export default function SellerHighReturnsAllTimeDashboard() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        min_items: 10,
        min_return_rate: 0.30
    });

    const RISK_COLORS = ['#ef4444', '#f59e0b', '#fbbf24', '#10b981'];

    // Fetch seller high returns all time data
    const fetchSellerHighReturnsAllTime = async () => {
        try {
            setLoading(true);
            const url = `/api/fraud/seller-returns-alltime?min_items=${filters.min_items}&min_return_rate=${filters.min_return_rate}`;

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
            console.error("Failed to fetch seller high returns all time:", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSellerHighReturnsAllTime();
    }, [filters]);

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-title">{data.seller_name}</p>
                    <p className="tooltip-item-blue">
                        Email: <strong>{data.contact_email}</strong>
                    </p>
                    <p className="tooltip-item-green">
                        Items Sold: <strong>{data.items_sold}</strong>
                    </p>
                    <p className="tooltip-item-orange">
                        Returns: <strong>{data.returns_count}</strong>
                    </p>
                    <p className="tooltip-item" style={{ color: '#ef4444', fontWeight: 'bold' }}>
                        Return Rate: {parseFloat(data.return_percentage).toFixed(2)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    // Calculate summary statistics
    const calculateStats = () => {
        if (data.length === 0) return {
            totalSellers: 0,
            totalReturns: 0,
            avgReturnRate: 0,
            totalItemsSold: 0
        };

        const totalSellers = data.length;
        const totalReturns = data.reduce((sum, item) => sum + parseInt(item.returns_count || 0), 0);
        const totalItemsSold = data.reduce((sum, item) => sum + parseInt(item.items_sold || 0), 0);
        const avgReturnRate = data.reduce((sum, item) => sum + parseFloat(item.return_percentage || 0), 0) / totalSellers;

        return { totalSellers, totalReturns, avgReturnRate, totalItemsSold };
    };

    const stats = calculateStats();

    // Get risk distribution
    const getRiskDistribution = () => {
        const critical = data.filter(s => s.return_percentage >= 50).length;
        const high = data.filter(s => s.return_percentage >= 40 && s.return_percentage < 50).length;
        const medium = data.filter(s => s.return_percentage >= 30 && s.return_percentage < 40).length;
        const low = data.filter(s => s.return_percentage < 30).length;

        return [
            { name: 'Critical (50%+)', value: critical, color: '#ef4444' },
            { name: 'High (40-50%)', value: high, color: '#f59e0b' },
            { name: 'Medium (30-40%)', value: medium, color: '#fbbf24' },
            { name: 'Low (<30%)', value: low, color: '#10b981' }
        ].filter(item => item.value > 0);
    };

    const riskDistribution = getRiskDistribution();

    // Get top 5 for radar chart
    const getRadarData = () => {
        return data.slice(0, 5).map(seller => ({
            seller: seller.seller_name.substring(0, 15) + '...',
            returnRate: parseFloat(seller.return_percentage)
        }));
    };

    const radarData = getRadarData();

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-heading">Seller High Returns (All Time) - Historical Quality Analysis</h2>

            {/* Filters */}
            <div style={{
                marginBottom: "20px",
                display: "flex",
                gap: "20px",
                alignItems: "center",
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                border: "2px solid #e5e7eb"
            }}>
                <div>
                    <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                        Min Items Sold (All Time):
                    </label>
                    <select
                        value={filters.min_items}
                        onChange={(e) => setFilters({ ...filters, min_items: parseInt(e.target.value) })}
                        className="year-select"
                    >
                        <option value={5}>5+</option>
                        <option value={10}>10+</option>
                        <option value={20}>20+</option>
                        <option value={50}>50+</option>
                        <option value={100}>100+</option>
                    </select>
                </div>

                <div>
                    <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                        Min Return Rate:
                    </label>
                    <select
                        value={filters.min_return_rate}
                        onChange={(e) => setFilters({ ...filters, min_return_rate: parseFloat(e.target.value) })}
                        className="year-select"
                    >
                        <option value={0.20}>20%+</option>
                        <option value={0.30}>30%+</option>
                        <option value={0.40}>40%+</option>
                        <option value={0.50}>50%+</option>
                    </select>
                </div>
            </div>

            <h3 className="performance-heading">
                Historical sellers with {filters.min_items}+ items sold and '&gt' {(filters.min_return_rate * 100).toFixed(0)}% lifetime return rate
            </h3>

            {/* Loading State */}
            {loading ? (
                <div className="loading-state">Loading historical seller data...</div>
            ) : data.length === 0 ? (
                <div className="empty-state">No sellers with high historical return rates detected</div>
            ) : (
                <div>
                    {/* Summary Cards */}
                    <div className="summary-cards">
                        <div className="summary-card summary-card-purple" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                            <h4 className="card-title">Problem Sellers</h4>
                            <p className="card-value">{stats.totalSellers}</p>
                        </div>

                        <div className="summary-card summary-card-pink" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                            <h4 className="card-title">Total Returns</h4>
                            <p className="card-value">{stats.totalReturns.toLocaleString()}</p>
                        </div>

                        <div className="summary-card summary-card-blue">
                            <h4 className="card-title">Avg Return Rate</h4>
                            <p className="card-value">{stats.avgReturnRate.toFixed(1)}%</p>
                        </div>

                        <div className="summary-card summary-card-orange">
                            <h4 className="card-title">Total Items Sold</h4>
                            <p className="card-value">{stats.totalItemsSold.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Charts Grid - 3 columns */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "20px",
                        marginBottom: "40px"
                    }}>
                        {/* Return Rate by Seller - Horizontal Bar */}
                        <div className="chart-card" style={{ gridColumn: "1 / 3" }}>
                            <h4 className="section-title">Return Rate % by Seller (Top 20)</h4>
                            <ResponsiveContainer width="100%" height={600}>
                                <BarChart
                                    data={data.slice(0, 20)}
                                    margin={{ top: 10, right: 10, left: 150, bottom: 20 }}
                                    layout="vertical"
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis type="number" style={{ fontSize: "12px", fill: "#6b7280" }} />
                                    <YAxis
                                        type="category"
                                        dataKey="seller_name"
                                        width={140}
                                        style={{ fontSize: "11px", fill: "#6b7280" }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="return_percentage" name="Return Rate %" radius={[0, 6, 6, 0]}>
                                        {data.slice(0, 20).map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.return_percentage >= 50 ? '#ef4444' :
                                                    entry.return_percentage >= 40 ? '#f59e0b' :
                                                        entry.return_percentage >= 30 ? '#fbbf24' : '#10b981'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Risk Distribution Pie */}
                        <div className="chart-card">
                            <h4 className="section-title">Risk Level Distribution</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={riskDistribution}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                    >
                                        {riskDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ marginTop: "20px" }}>
                                {riskDistribution.map((item, index) => (
                                    <div key={index} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        marginBottom: "8px"
                                    }}>
                                        <div style={{
                                            width: "16px",
                                            height: "16px",
                                            backgroundColor: item.color,
                                            borderRadius: "4px"
                                        }}></div>
                                        <span style={{ fontSize: "14px", color: "#374151" }}>
                                            {item.name}: <strong>{item.value}</strong>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* Data Table */}
                    <div className="table-container">
                        <h4 className="section-title">Historical Seller Quality Issues</h4>
                        <table className="data-table">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-header-cell">Rank</th>
                                    <th className="table-header-cell">Risk Level</th>
                                    <th className="table-header-cell">Seller ID</th>
                                    <th className="table-header-cell">Seller Name</th>
                                    <th className="table-header-cell">Contact Email</th>
                                    <th className="table-header-cell-right">Items Sold</th>
                                    <th className="table-header-cell-right">Returns</th>
                                    <th className="table-header-cell-right">Return Rate %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((seller, index) => {
                                    const returnRate = parseFloat(seller.return_percentage);
                                    const riskLevel = returnRate >= 50 ? 'CRITICAL' :
                                        returnRate >= 40 ? 'HIGH' :
                                            returnRate >= 30 ? 'MEDIUM' : 'LOW';
                                    const riskColor = returnRate >= 50 ? '#ef4444' :
                                        returnRate >= 40 ? '#f59e0b' :
                                            returnRate >= 30 ? '#fbbf24' : '#10b981';

                                    return (
                                        <tr key={index} className="table-row">
                                            <td className="table-cell">{index + 1}</td>
                                            <td className="table-cell">
                                                <span style={{
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                    fontSize: "12px",
                                                    fontWeight: "600",
                                                    backgroundColor: `${riskColor}20`,
                                                    color: riskColor
                                                }}>
                                                    {riskLevel}
                                                </span>
                                            </td>
                                            <td className="table-cell">{seller.seller_id}</td>
                                            <td className="table-cell-bold">{seller.seller_name}</td>
                                            <td className="table-cell">{seller.contact_email}</td>
                                            <td className="table-cell-right">{seller.items_sold}</td>
                                            <td className="table-cell-right" style={{ color: '#ef4444', fontWeight: '700' }}>
                                                {seller.returns_count}
                                            </td>
                                            <td className="table-cell-right" style={{ color: riskColor, fontWeight: '700' }}>
                                                {returnRate.toFixed(2)}%
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