import React from 'react';
import { AlertTriangle, Package, Percent, DollarSign } from 'lucide-react';

export default function ReturnsPage() {
    const analyses = [
        { icon: Package, title: 'Most Returned Products', description: 'Identify products with highest return rates', color: '#ef4444' },
        { icon: Percent, title: 'Return Rate Analysis', description: 'Calculate return percentage per product', color: '#f59e0b' },
        { icon: DollarSign, title: 'Revenue Loss from Returns', description: 'Measure financial impact of returns', color: '#dc2626' },
    ];

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: '#333', marginBottom: '8px' }}>Returns & Risk Analysis</h1>
                <p style={{ color: '#666', fontSize: '14px' }}>Analyze returns, losses, and risk patterns</p>
            </div>

            <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                <AlertTriangle size={24} color="#dc2626" />
                <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#991b1b' }}>
                        Risk Monitoring Active
                    </h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#7f1d1d' }}>
                        Track product returns and identify patterns that may indicate quality issues
                    </p>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px'
            }}>
                {analyses.map((analysis, index) => {
                    const Icon = analysis.icon;
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
                                background: `${analysis.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '16px'
                            }}>
                                <Icon size={24} color={analysis.color} />
                            </div>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#333' }}>
                                {analysis.title}
                            </h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                                {analysis.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
