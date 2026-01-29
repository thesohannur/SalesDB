import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  DollarSign,
  Users
} from 'lucide-react';
import '../../components/styles/AnalyticsPages.css';

export default function TimeCustomerPage() {
  const navigate = useNavigate();

  const dashboards = [
    {
      icon: Calendar,
      title: 'Monthly Revenue per Year',
      description: 'Track monthly revenue patterns and year-over-year growth',
      features: ['Monthly revenue trends', 'YoY comparison', 'Revenue growth %', 'Best performing months'],
      color: '#667eea',
      path: '/dashboard/monthly-revenue'
    },
    {
      icon: BarChart3,
      title: 'Monthly Order Count',
      description: 'Analyze monthly order volume and customer engagement',
      features: ['Order count trends', 'Customer patterns', 'Monthly comparisons', 'Order frequency'],
      color: '#10b981',
      path: '/dashboard/monthly-order-count'
    },
    {
      icon: TrendingUp,
      title: 'Monthly Sales Trend',
      description: 'Comprehensive monthly sales analysis with multiple metrics',
      features: ['Combined revenue & orders', 'Growth rate analysis', 'Customer trends', 'Products sold trends'],
      color: '#f59e0b',
      path: '/dashboard/monthly-sales-trend'
    },
    {
      icon: DollarSign,
      title: 'Average Order Value (AOV)',
      description: 'Track and analyze average order value over time',
      features: ['AOV trends', 'Median vs Average', 'Min/Max order values', 'Monthly comparisons'],
      color: '#ef4444',
      path: '/dashboard/average-order-value'
    },
    {
      icon: Users,
      title: 'Customer Lifetime Value (CLTV)',
      description: 'Measure customer value and segmentation',
      features: ['Customer segmentation', 'VIP identification', 'Purchase frequency', 'Value distribution'],
      color: '#8b5cf6',
      path: '/dashboard/customer-lifetime-value'
    },
  ];

  return (
    <div className="analytics-home-container">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate('/')}>
        <ArrowLeft size={20} />
        <span>Back to Analytics Home</span>
      </button>

      {/* Header */}
      <div className="analytics-header">
        <div>
          <h1 className="analytics-main-title">Time & Customer Intelligence</h1>
          <p className="analytics-subtitle">Behavioral and longitudinal insights</p>
        </div>
        <div className="category-badge-large badge-active">
          {dashboards.length} Dashboards
        </div>
      </div>

      {/* Dashboards Grid */}
      <div className="dashboards-grid">
        {dashboards.map((dashboard, index) => {
          const Icon = dashboard.icon;
          
          return (
            <div
              key={index}
              className="dashboard-card"
              onClick={() => navigate(dashboard.path)}
            >
              <div className="dashboard-icon-wrapper">
                <div className="dashboard-icon" style={{ backgroundColor: `${dashboard.color}15` }}>
                  <Icon size={32} color={dashboard.color} />
                </div>
              </div>

              <div className="dashboard-content">
                <h3 className="dashboard-title">{dashboard.title}</h3>
                <p className="dashboard-description">{dashboard.description}</p>
                
                <div className="dashboard-features">
                  <h4 className="features-title">Key Features:</h4>
                  <ul className="features-list">
                    {dashboard.features.map((feature, idx) => (
                      <li key={idx}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13.3334 4L6.00002 11.3333L2.66669 8" stroke={dashboard.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="dashboard-footer">
                <button className="view-dashboard-btn" style={{ color: dashboard.color }}>
                  View Dashboard
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}