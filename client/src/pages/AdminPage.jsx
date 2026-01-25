import React from 'react';
import { Settings, Database, Zap, Shield, Eye } from 'lucide-react';

export default function AdminPage() {
    const tools = [
        {
            icon: Database,
            title: 'Functions',
            description: 'Reusable analytics functions (CLTV, Profit Margin, etc.)',
            color: '#667eea'
        },
        {
            icon: Settings,
            title: 'Procedures',
            description: 'Data mutation procedures (Orders, Inventory, Returns)',
            color: '#10b981'
        },
        {
            icon: Zap,
            title: 'Triggers',
            description: 'Automated workflows and integrity checks',
            color: '#f59e0b'
        },
        {
            icon: Eye,
            title: 'Monitoring',
            description: 'Low stock alerts, fraud detection, revenue tracking',
            color: '#ec4899'
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: '#333', marginBottom: '8px' }}>Admin Tools</h1>
                <p style={{ color: '#666', fontSize: '14px' }}>Advanced database operations and monitoring</p>
            </div>

            <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                <Shield size={24} color="#2563eb" />
                <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#1e40af' }}>
                        Advanced Operations
                    </h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#1e3a8a' }}>
                        Manage database functions, procedures, triggers, and optimization tools
                    </p>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px'
            }}>
                {tools.map((tool, index) => {
                    const Icon = tool.icon;
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
                                background: `${tool.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '16px'
                            }}>
                                <Icon size={24} color={tool.color} />
                            </div>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#333' }}>
                                {tool.title}
                            </h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                                {tool.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
