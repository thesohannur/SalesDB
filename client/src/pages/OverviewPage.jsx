import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    DollarSign,
    ShoppingBag,
    Package,
    Activity,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';
import './OverviewPage.css';

export default function OverviewPage() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                // Using port 5001 to avoid macOS conflict on 5000
                const response = await axios.get('http://localhost:5001/api/overview/summary');
                setSummary(response.data);
            } catch (error) {
                console.error('Error fetching overview summary:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) return <div className="overview-container">Loading overview...</div>;

    const cards = [
        { label: 'Total Revenue', value: `$${summary?.totalRevenue?.toLocaleString()}`, icon: DollarSign, className: 'revenue-card' },
        { label: 'Total Orders', value: summary?.totalOrders?.toLocaleString(), icon: ShoppingBag, className: 'orders-card' },
        { label: 'Items Sold', value: summary?.totalItems?.toLocaleString(), icon: Package, className: 'items-card' },
        { label: 'Avg Sale Value', value: `$${(summary?.totalRevenue / summary?.totalOrders || 0).toFixed(2)}`, icon: TrendingUp, className: 'health-card' },
    ];

    return (
        <div className="overview-container">
            <header className="overview-header">
                <h1>Executive Overview</h1>
                <p>Welcome back! Here's a snapshot of your business performance.</p>
            </header>

            <div className="summary-cards">
                {cards.map((card, index) => (
                    <div key={index} className={`summary-card ${card.className}`}>
                        <div className="card-icon">
                            <card.icon size={24} />
                        </div>
                        <div className="card-label">{card.label}</div>
                        <div className="card-value">{card.value}</div>
                    </div>
                ))}
            </div>

            <div className="business-section">
                <section className="business-profile">
                    <h2>Business Profile</h2>
                    <p>{summary?.businessDescription}</p>
                    <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                        <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px' }}>Global Reach</span>
                        <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px' }}>Premium Sellers</span>
                    </div>
                </section>

                <section className="health-status">
                    <h3>Operational Health</h3>
                    <div className="health-item">
                        <span className="health-label">Sales Momentum</span>
                        <span className="health-value">{summary?.health?.salesVolume}</span>
                    </div>
                    <div className="health-item">
                        <span className="health-label">Active Partners</span>
                        <span className="health-value">{summary?.health?.activeUsers} Sellers</span>
                    </div>
                    <div className="health-item">
                        <span className="health-label">Risk Assessment</span>
                        <span className="health-value" style={{ color: '#22c55e' }}>{summary?.health?.riskLevel}</span>
                    </div>
                    <div className="health-item">
                        <span className="health-label">System Integrity</span>
                        <span className="health-value"><ShieldCheck size={18} /> Verified</span>
                    </div>
                </section>
            </div>

            <div className="activity-feed" style={{ marginTop: '40px', background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Recent Activity Snapshot</h3>
                <div className="activity-list">
                    {summary?.recentActivity?.map((activity, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <div style={{ background: '#f0fdf4', color: '#22c55e', padding: '8px', borderRadius: '10px' }}>
                                <TrendingUp size={16} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600', color: '#1a1a1a' }}>Bulk Sales Recorded</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>{new Date(activity.sales_date).toLocaleDateString()}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: '700', color: '#6366f1' }}>+${activity.sales_amount?.toLocaleString()}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>{activity.total_orders} Orders</div>
                            </div>
                        </div>
                    ))}
                    {(!summary?.recentActivity || summary?.recentActivity.length === 0) && (
                        <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>No recent activity found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
