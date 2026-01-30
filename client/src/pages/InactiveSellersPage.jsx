import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    UserX,
    Mail,
    Calendar,
    ArrowLeft,
    Clock,
    BarChart3,
    TrendingUp,
    ChevronRight,
    UserCheck
} from 'lucide-react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function InactiveSellersPage() {
    const currentDate = new Date();
    const defaultEndMonth = '2024-12';
    const defaultStartMonth = '2024-01';

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startMonth, setStartMonth] = useState(defaultStartMonth);
    const [endMonth, setEndMonth] = useState(defaultEndMonth);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5001/api/analytics/inactive-sellers`, {
                    params: { startMonth, endMonth }
                });
                setData(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching inactive sellers range:', error);
                setError(error.response?.data?.error || "Failed to fetch data. Please ensure the SQL function is installed.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [startMonth, endMonth]);

    const generateMonthOptions = () => {
        const months = [];
        const start = new Date(2015, 0);
        const end = new Date();
        
        for (let d = start; d <= end; d.setMonth(d.getMonth() + 1)) {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            months.push(`${year}-${month}`);
        }
        
        return months.reverse();
    };

    const getHealthStatus = (ratio) => {
        if (ratio < 20) return { label: '🟢 Healthy', color: '#10b981' };
        if (ratio < 40) return { label: '🟡 Warning', color: '#f59e0b' };
        return { label: '🔴 Critical', color: '#ef4444' };
    };

    const sellers = data?.inactive_sellers || [];
    const summary = data?.summary || { inactive_count: 0, total_sellers: 0, inactive_ratio: 0 };
    const trendData = data?.trend_data || [];
    const healthStatus = getHealthStatus(summary.inactive_ratio);

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#f8fafc' }}>

            {/* Main Title & Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', gap: '24px', flexWrap: 'wrap' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ padding: '4px 12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '100px', fontSize: '12px', fontWeight: '700' }}>
                            DORMANT ANALYSIS
                        </div>
                    </div>
                    <h1 style={{ fontSize: '38px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '8px' }}>Inactivity Curve</h1>
                    <p style={{ color: '#64748b', fontSize: '18px', maxWidth: '600px' }}>Select a timeframe to identify silent partners and visualize retention health.</p>
                </div>

                <div style={{
                    display: 'flex', gap: '20px', background: 'white', padding: '24px', borderRadius: '24px',
                    border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'grid', gap: '8px' }}>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Analyze From</label>
                        <select value={startMonth} onChange={(e) => setStartMonth(e.target.value)} style={{ padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: '600', outline: 'none', background: '#f8fafc', minWidth: '150px' }}>
                            {generateMonthOptions().map(month => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ color: '#cbd5e1', paddingTop: '18px' }}><ChevronRight /></div>
                    <div style={{ display: 'grid', gap: '8px' }}>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Analyze Until</label>
                        <select value={endMonth} onChange={(e) => setEndMonth(e.target.value)} style={{ padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: '600', outline: 'none', background: '#f8fafc', minWidth: '150px' }}>
                            {generateMonthOptions().map(month => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Statistics Dashboard */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr) 2fr', gap: '24px', marginBottom: '48px' }}>
                <div style={{ background: 'white', padding: '32px', borderRadius: '32px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ color: '#ef4444', height: '40px', width: '40px', background: '#fef2f2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                        <UserX size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: '48px', fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}>{summary.inactive_count}</div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inactive Sellers</div>
                        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '12px' }}>0 sales in range</p>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '32px', borderRadius: '32px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ color: healthStatus.color, height: '40px', width: '40px', background: healthStatus.color === '#10b981' ? '#f0fdf4' : healthStatus.color === '#f59e0b' ? '#fffbeb' : '#fef2f2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                        <BarChart3 size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: '48px', fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}>{summary.inactive_ratio}%</div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: healthStatus.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inactive Ratio</div>
                        <div style={{ marginTop: '12px', padding: '8px 12px', background: healthStatus.color === '#10b981' ? '#f0fdf4' : healthStatus.color === '#f59e0b' ? '#fffbeb' : '#fef2f2', borderRadius: '8px', fontSize: '13px', fontWeight: '700', color: healthStatus.color }}>
                            {healthStatus.label}
                        </div>
                    </div>
                </div>

                <div style={{ background: '#0f172a', padding: '32px', borderRadius: '32px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Inactivity Trend</h3>
                            <div style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}>LIVE METRICS</div>
                        </div>
                        <div style={{ height: '140px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: 'white' }}
                                        itemStyle={{ color: 'white' }}
                                    />
                                    <Line type="monotone" dataKey="inactive_count" name="Inactive" stroke="#ef4444" strokeWidth={4} dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                </div>
            </div>

            {/* Seller List Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' }}>Partners to Re-engage</h2>
                <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Showing {sellers.length} out of {summary.total_sellers} sellers</div>
            </div>

            {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: '16px', borderRadius: '16px', marginBottom: '32px', color: '#b91c1c', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '20px' }}>⚠️</div>
                    <div>
                        {error}
                        <p style={{ fontSize: '13px', fontWeight: '400', marginTop: '4px' }}>Troubleshooting: Run the SQL script in Supabase to enable range-based analytics.</p>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '120px', background: 'white', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
                    <div style={{ width: '48px', height: '48px', border: '4px solid #f1f5f9', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }}></div>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <p style={{ color: '#64748b', fontWeight: '700', fontSize: '18px' }}>Syncing Range Data...</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '32px' }}>
                    {sellers.length > 0 ? (
                        sellers.map((seller, index) => (
                        <div key={index} style={{
                            background: 'white', padding: '40px', borderRadius: '32px', border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '32px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative'
                        }} onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
                        }} onMouseLeave={e => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02)';
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                        <UserX size={32} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>{seller.seller_name}</h3>
                                        <p style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Partner ID: #{seller.seller_id}</p>
                                    </div>
                                </div>
                                <div style={{
                                    background: '#fef2f2', color: '#b91c1c', padding: '8px 16px', borderRadius: '12px',
                                    fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px'
                                }}>
                                    <Clock size={14} />
                                    {seller.days_inactive === null ? 'NEVER ACTIVE' : `${seller.days_inactive}D INACTIVE`}
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', display: 'grid', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ color: '#64748b', fontWeight: '600' }}>Last Transaction</span>
                                    <span style={{ color: '#0f172a', fontWeight: '800' }}>{seller.last_active_date ? new Date(seller.last_active_date).toLocaleDateString() : 'Never Recorded'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ color: '#64748b', fontWeight: '600' }}>Contact Info</span>
                                    <span style={{ color: '#6366f1', fontWeight: '800' }}>{seller.email}</span>
                                </div>
                            </div>

                            <button
                                style={{
                                    width: '100%', padding: '18px', borderRadius: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none',
                                    color: 'white', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', gap: '12px', transition: 'all 0.2s', fontSize: '15px'
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                                <Mail size={18} /> Contact Seller
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', background: '#f0fdf4', borderRadius: '48px', border: '2px dashed #bbf7d0' }}>
                        <div style={{ width: '80px', height: '80px', background: '#dcfce7', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                            <UserCheck size={40} />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: '900', color: '#064e3b', marginBottom: '12px' }}>Peak Efficiency Reached!</h3>
                        <p style={{ color: '#065f46', maxWidth: '450px', margin: '0 auto', fontSize: '18px', lineHeight: '1.6' }}>Every single seller has been active in this range. Your retention strategy is working perfectly.</p>
                    </div>
                )}
                </div>
            )}
        </div>
    );
}
