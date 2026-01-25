import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
    Home,
    CheckCircle,
    TrendingUp,
    Award,
    AlertTriangle,
    Settings
} from 'lucide-react';

export default function DashboardLayout() {
    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Overview', end: true },
        { path: '/dashboard/integrity', icon: CheckCircle, label: 'Data Integrity' },
        { path: '/dashboard/analytics', icon: TrendingUp, label: 'Analytics' },
        { path: '/dashboard/rankings', icon: Award, label: 'Rankings' },
        { path: '/dashboard/returns', icon: AlertTriangle, label: 'Returns & Risk' },
        { path: '/dashboard/admin', icon: Settings, label: 'Admin Tools' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
                position: 'fixed',
                height: '100vh',
                overflowY: 'auto'
            }}>
                <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>SalesDB</h1>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.8 }}>Analytics Platform</p>
                </div>

                <nav style={{ flex: 1, padding: '16px 0' }}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 24px',
                                    color: 'white',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                    background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                                    borderLeft: isActive ? '4px solid white' : '4px solid transparent',
                                    fontWeight: isActive ? '600' : '400',
                                })}
                                onMouseEnter={(e) => {
                                    if (!e.currentTarget.classList.contains('active')) {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!e.currentTarget.classList.contains('active')) {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', opacity: 0.7 }}>
                    <NavLink
                        to="/"
                        style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        ← Back to Home
                    </NavLink>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <header style={{
                    background: 'white',
                    padding: '16px 32px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>Dashboard</h2>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
