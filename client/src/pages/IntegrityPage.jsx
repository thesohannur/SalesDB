import React from 'react';
import { Database, CheckCircle } from 'lucide-react';

export default function IntegrityPage() {
    const tables = [
        'Customers', 'Products', 'Sellers', 'Categories', 'Orders',
        'Order Items', 'Inventory', 'Payments', 'Shipping', 'Returns'
    ];

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: '#333', marginBottom: '8px' }}>Data Integrity Verification</h1>
                <p style={{ color: '#666', fontSize: '14px' }}>Verify base data integrity across all tables</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
            }}>
                {tables.map((table, index) => (
                    <div
                        key={index}
                        style={{
                            background: 'white',
                            padding: '24px',
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <Database size={24} color="#667eea" />
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#333' }}>{table}</h3>
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                            Verify data consistency and integrity
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                            <CheckCircle size={16} />
                            <span style={{ fontSize: '13px', fontWeight: '500' }}>Ready to verify</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
