import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
    Home,
    CheckCircle,
    TrendingUp,
    AlertTriangle,
    Settings
} from 'lucide-react';

import '../styles/SideBar.css';

export default function DashboardLayout() {
    const [isExpanded, setIsExpanded] = useState(false);

    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Overview', end: true },
        { path: '/dashboard/integrity', icon: CheckCircle, label: 'Data Integrity' },
        { path: '/dashboard/analytics', icon: TrendingUp, label: 'Analytics' },
        { path: '/dashboard/admin', icon: Settings, label: 'Admin Tools' },
        { path: '/dashboard/tester', icon: AlertTriangle, label: 'Tester' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
            {/* Sidebar */}
            <aside
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
                className={`sidebar-container ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}
            >
                <div style={{
                    padding: '24px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    minHeight: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ width: '60px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                        <Home size={28} />
                    </div>
                    {isExpanded && (
                        <div style={{ flex: 1, paddingRight: '20px' }}>
                            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>SalesDB</h1>
                            <p style={{ margin: 0, fontSize: '11px', opacity: 0.8, whiteSpace: 'nowrap' }}>Analytics Platform</p>
                        </div>
                    )}
                </div>

                <nav style={{ flex: 1, padding: '16px 0', overflowX: 'hidden' }}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px 0',
                                    width: '100%',
                                    color: 'white',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                    background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                                    fontWeight: isActive ? '600' : '400',
                                    position: 'relative'
                                })}
                            >
                                <div style={{ width: '60px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon size={22} />
                                </div>
                                {isExpanded && (
                                    <span style={{
                                        flex: 1,
                                        paddingRight: '20px',
                                        whiteSpace: 'nowrap',
                                        fontSize: '15px'
                                    }}>
                                        {item.label}
                                    </span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                <div style={{
                    padding: '24px 0',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                    <NavLink
                        to="/"
                        style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', width: '100%' }}
                    >
                        <div style={{ width: '60px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: '20px' }}>←</span>
                        </div>
                        {isExpanded && (
                            <span style={{ flex: 1, paddingRight: '20px', fontSize: '14px', opacity: 0.8 }}>Back to Home</span>
                        )}
                    </NavLink>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Header */}
                <header style={{
                    background: 'white',
                    padding: '12px 32px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>Sales DB</h2>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
