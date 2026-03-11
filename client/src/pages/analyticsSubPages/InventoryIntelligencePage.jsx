import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertTriangle,
  TrendingUp,
  AlertCircle,
  Warehouse,
  Brain
} from 'lucide-react';
import '../../components/styles/AnalyticsPages.css';

export default function InventoryIntelligencePage() {
  const navigate = useNavigate();

  const dashboards = [
    {
      icon: AlertTriangle,
      title: 'Low Stock Products Dashboard',
      description: 'Monitor and manage products at or below minimum stock levels',
      features: [
        'Stock deficit analysis',
        'Severity classification',
        'Warehouse-wise breakdown',
        'Urgent restock alerts'
      ],
      color: '#ef4444',
      path: '/dashboard/analytics/inventory/low-stock'
    },
    {
      icon: TrendingUp,
      title: 'Fast Moving Products Dashboard',
      description: 'Identify high-velocity products driving sales',
      features: [
        'Velocity rating system',
        'Sales trend analysis',
        'Category performance',
        'Daily sales metrics'
      ],
      color: '#10b981',
      path: '/dashboard/analytics/inventory/fast-moving'
    },
    {
      icon: AlertCircle,
      title: 'High Return Products Dashboard',
      description: 'Track products with elevated return rates',
      features: [
        'Return rate analysis',
        'Quality risk assessment',
        'Net demand calculation',
        'Category-wise returns'
      ],
      color: '#f97316',
      path: '/dashboard/analytics/inventory/high-returns'
    },
    {
      icon: Warehouse,
      title: 'Warehouse Load Intelligence Dashboard',
      description: 'Comprehensive warehouse capacity and performance analysis',
      features: [
        'Capacity utilization',
        'Stock distribution',
        'Low stock alerts by warehouse',
        'Performance radar charts'
      ],
      color: '#3b82f6',
      path: '/dashboard/analytics/inventory/warehouse-load-intelligence'
    },
    {
      icon: Brain,
      title: 'Inventory Intelligence Score Dashboard',
      description: 'Inventory optimization recommendations',
      features: [
        'Risk level classification',
        'Days of stock forecasting',
        'Automated action recommendations',
        'Priority scoring system'
      ],
      color: '#8b5cf6',
      path: '/dashboard/analytics/inventory/inventory-intelligence-score'
    },
  ];

  return (
    <div className="analytics-home-container">

      {/* Header */}
      <div className="analytics-header">
        <div>
          <h1 className="analytics-main-title">Inventory Intelligence</h1>
          <p className="analytics-subtitle">Stock health, supply risk, and intelligent inventory management</p>
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