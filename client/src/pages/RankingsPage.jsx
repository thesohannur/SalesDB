import React from 'react';
import { Award, TrendingUp, Star, MapPin, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RankingsPage() {
    const navigate = useNavigate();
    const rankings = [
        { icon: Star, title: 'Top Selling Products', description: 'Best performing products by sales volume', color: '#f59e0b', path: '#' },
        { icon: MapPin, title: 'Best Category per State', description: 'Leading categories in each region', color: '#10b981', path: '#' },
        { icon: Award, title: 'Top Performing Sellers', description: 'Highest revenue generating sellers', color: '#667eea', path: '#' },
        { icon: TrendingUp, title: 'Top Customers per State', description: 'Most valuable customers by location', color: '#ec4899', path: '#' },
        { icon: UserX, title: 'Inactive Sellers', description: 'Detect sellers with no recent activity', color: '#ef4444', path: '/dashboard/inactive-sellers' },
    ];

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: '#333', marginBottom: '8px' }}>Rankings & Segmentation</h1>
                <p style={{ color: '#666', fontSize: '14px' }}>Advanced ranking and performance analysis</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px'
            }}>
                {rankings.map((ranking, index) => {
                    const Icon = ranking.icon;
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
                            onClick={() => ranking.path !== '#' && navigate(ranking.path)}
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
                                background: `${ranking.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '16px'
                            }}>
                                <Icon size={24} color={ranking.color} />
                            </div>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#333' }}>
                                {ranking.title}
                            </h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                                {ranking.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
