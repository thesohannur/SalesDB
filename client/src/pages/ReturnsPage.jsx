import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ArrowLeft,
    AlertTriangle,
    TrendingDown,
    PackageSearch,
    Calendar,
    BarChart3,
    Clock,
    Filter
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LineChart,
    Line
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const Tab = ({ label, active, onClick, icon: Icon }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            background: active ? '#6366f1' : 'transparent',
            color: active ? 'white' : '#666',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: active ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
        }}
    >
        <Icon size={18} />
        {label}
    </button>
);

export default function ReturnsPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [data, setData] = useState([]);
    const [year, setYear] = useState('all');
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [analyticsRes, yearsRes] = await Promise.all([
                    axios.get(`http://localhost:5001/api/analytics/returns?type=${activeTab}&year=${year}`),
                    axios.get('http://localhost:5001/api/daily-sales/years')
                ]);
                setData(analyticsRes.data);
                setYears(yearsRes.data.map(y => y.sales_year));
            } catch (error) {
                console.error('Error fetching return analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeTab, year]);

    const totalLost = data.reduce((acc, curr) => acc + (curr.revenue_lost || 0), 0);
    const avgReturnRate = data.length > 0
        ? (data.reduce((acc, curr) => acc + curr.return_rate, 0) / data.length).toFixed(1)
        : 0;

    const getMonthName = (num) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months[num - 1] || num;
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Returns & Risk Analysis</h1>
                    <p style={{ color: '#666' }}>Deep dive into product return patterns and financial vulnerability.</p>
                </div>

                {activeTab !== 'all' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '8px 16px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <Filter size={18} color="#6366f1" />
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: '600' }}
                        >
                            <option value="all">All Years</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', background: '#f1f5f9', padding: '6px', borderRadius: '16px', width: 'fit-content' }}>
                <Tab label="All Time" active={activeTab === 'all'} onClick={() => setActiveTab('all')} icon={BarChart3} />
                <Tab label="Yearly" active={activeTab === 'year'} onClick={() => setActiveTab('year')} icon={Calendar} />
                <Tab label="Monthly" active={activeTab === 'month'} onClick={() => setActiveTab('month')} icon={Clock} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
                    <div style={{ color: '#ef4444', marginBottom: '12px' }}><AlertTriangle size={24} /></div>
                    <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Impact Value</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>${totalLost.toLocaleString()}</div>
                    <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>Revenue lost to returns</div>
                </div>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
                    <div style={{ color: '#f59e0b', marginBottom: '12px' }}><TrendingDown size={24} /></div>
                    <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Avg Return Rate</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>{avgReturnRate}%</div>
                    <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '4px' }}>Across selected period</div>
                </div>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
                    <div style={{ color: '#6366f1', marginBottom: '12px' }}><PackageSearch size={24} /></div>
                    <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Units Returned</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>
                        {data.reduce((acc, curr) => acc + (curr.total_returned || 0), 0).toLocaleString()}
                    </div>
                </div>
            </div>

            <div style={{ background: '#fff', padding: '32px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '700' }}>
                        {activeTab === 'all' ? 'Top Returned Products' : activeTab === 'year' ? 'Annual Return Trends' : 'Monthly Performance'}
                    </h3>
                </div>

                <div style={{ height: '400px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        {activeTab === 'all' ? (
                            <BarChart data={data.slice(0, 10)}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="product_name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="return_rate" radius={[6, 6, 0, 0]} barSize={40}>
                                    {data.slice(0, 10).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.return_rate > 15 ? '#ef4444' : '#6366f1'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        ) : (
                            <LineChart data={activeTab === 'month' ? data.map(d => ({ ...d, period: `${getMonthName(d.sales_month)} ${d.sales_year}` })) : data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Line type="monotone" dataKey="return_rate" stroke="#6366f1" strokeWidth={3} dot={{ stroke: '#6366f1', strokeWidth: 2, r: 6, fill: '#fff' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ background: '#fff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', overflowX: 'auto' }}>
                <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '700' }}>Performance Details</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc' }}>
                            <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Product</th>
                            {activeTab !== 'all' && (
                                <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Period</th>
                            )}
                            <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Total Sold</th>
                            <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Returned</th>
                            <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Return Rate</th>
                            <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Loss Impact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#fefefe'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>
                                    {item.product_name}
                                </td>
                                {activeTab !== 'all' && (
                                    <td style={{ padding: '16px', color: '#64748b' }}>
                                        {activeTab === 'year' ? item.period : `${getMonthName(item.sales_month)} ${item.sales_year}`}
                                    </td>
                                )}
                                <td style={{ padding: '16px' }}>{item.total_sold}</td>
                                <td style={{ padding: '16px' }}>{item.total_returned}</td>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '60px', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${Math.min(item.return_rate, 100)}%`, height: '100%', background: item.return_rate > 15 ? '#ef4444' : '#6366f1' }} />
                                        </div>
                                        <span style={{ fontWeight: '600', color: item.return_rate > 15 ? '#ef4444' : '#0f172a' }}>{item.return_rate.toFixed(1)}%</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px', color: '#ef4444', fontWeight: '700' }}>-${parseFloat(item.revenue_lost).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
