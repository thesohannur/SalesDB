import React from 'react';
import { TrendingUp, Calendar, DollarSign, Users } from 'lucide-react';

export default function AnalyticsPage() {
    const metrics = [
        { icon: Calendar, title: 'Monthly Revenue', description: 'Revenue trends by month and year', color: '#667eea' },
        { icon: TrendingUp, title: 'Monthly Sales Trend', description: 'Track sales patterns over time', color: '#10b981' },
        { icon: DollarSign, title: 'Average Order Value', description: 'Calculate AOV across periods', color: '#f59e0b' },
        { icon: Users, title: 'Customer Lifetime Value', description: 'Measure CLTV per customer', color: '#ef4444' },
    ];

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: '#333', marginBottom: '8px' }}>Time-Based Analytics</h1>
                <p style={{ color: '#666', fontSize: '14px' }}>Customer and time-based metrics</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px'
            }}>
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <div
                            key={index}
                            style={{
                                background: 'white',
                                padding: '28px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                border: '1px solid #e5e7eb',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                            }}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: `${metric.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '16px'
                            }}>
                                <Icon size={24} color={metric.color} />
                            </div>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#333' }}>
                                {metric.title}
                            </h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                                {metric.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
