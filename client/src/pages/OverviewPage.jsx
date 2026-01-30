import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  BarChart3, 
  Users, 
  DollarSign,
  Package,
  ArrowRight,
  Activity,
  PieChart,
  Zap
} from 'lucide-react';
import '../components/styles/OverviewPage.css';

export default function OverviewPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Monitor your business performance with live dashboards and instant insights',
      color: '#667eea'
    },
    {
      icon: TrendingUp,
      title: 'Trend Analysis',
      description: 'Identify patterns and forecast future performance with advanced analytics',
      color: '#10b981'
    },
    {
      icon: Users,
      title: 'Customer Intelligence',
      description: 'Understand customer behavior, lifetime value, and segmentation',
      color: '#f59e0b'
    },
    {
      icon: DollarSign,
      title: 'Revenue Optimization',
      description: 'Track revenue streams across products, categories, and sellers',
      color: '#ef4444'
    },
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Monitor stock levels, predict demand, and prevent stockouts',
      color: '#8b5cf6'
    },
    {
      icon: Zap,
      title: 'Advanced & Deep-Level Analytics',
      description: 'Access advanced insights and smart alerts for critical metrics',
      color: '#ec4899'
    }
  ];

  const stats = [
    { value: '10+', label: 'Active Dashboards', icon: PieChart },
    { value: '50+', label: 'Graphs & Key Matrics', icon: Activity },
    { value: '8', label: 'Analytics Categories', icon: BarChart3 },
    { value: '100%', label: 'Data Accuracy', icon: Zap }
  ];

  const capabilities = [
  'Daily sales tracking and trend analysis',
  'Product performance and revenue attribution',
  'Customer lifetime value (CLTV) insights',
  'Average order value (AOV) insights',
  'Seller performance monitoring and ranking',
  'Monthly and yearly sales trend analysis',
  'Quantity sold analytics (per product/category/year)',
  'Revenue per product, seller, and category',
  'Return analysis, return rate, and quality control',
  'Revenue loss and risk monitoring',
  'Profit margin and product profitability analysis',
  'Revenue growth and YoY performance metrics',
  'Low stock alerts and inventory intelligence',
  'Inactive seller detection and segmentation',
  'Customer segmentation and RFM analysis',
  'Fraud pattern detection and anomaly alerts',
  'Automated triggers and transactional integrity'
];


  return (
    <div className="overview-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={16} />
            <span>Advanced Business Intelligence Platform</span>
          </div>
          <h1 className="hero-title">
            Transform Data Into
            <span className="gradient-text"> Actionable Insights</span>
          </h1>
          <p className="hero-description">
            A comprehensive analytics platform designed to help you make data-driven decisions, 
            optimize operations, and accelerate business growth through powerful visualizations 
            and real-time intelligence.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/dashboard/analytics')}>
              Explore Insights
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="mini-chart">
              <TrendingUp size={24} color="#10b981" />
              <div className="chart-info">
                <span className="chart-label">Revenue Growth</span>
                <span className="chart-value">+24.5%</span>
              </div>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="mini-chart">
              <Users size={24} color="#667eea" />
              <div className="chart-info">
                <span className="chart-label">Active Customers</span>
                <span className="chart-value">2,847</span>
              </div>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="mini-chart">
              <DollarSign size={24} color="#f59e0b" />
              <div className="chart-info">
                <span className="chart-label">Total Revenue</span>
                <span className="chart-value">$458K</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  <Icon size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="section-header">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">
            Everything you need to understand and grow your business
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="feature-card">
                <div className="feature-icon" style={{ backgroundColor: `${feature.color}15` }}>
                  <Icon size={28} color={feature.color} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Capabilities Section */}
      <div className="capabilities-section">
        <div className="capabilities-container">
          <div className="capabilities-content">
            <h2 className="capabilities-title">What You Can Do</h2>
            <p className="capabilities-subtitle">
              Comprehensive analytics capabilities at your fingertips
            </p>
            <div className="capabilities-list">
              {capabilities.map((capability, index) => (
                <div key={index} className="capability-item">
                  <div className="capability-check">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="10" fill="#10b981"/>
                      <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>{capability}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="capabilities-visual">
            <div className="visual-card">
              <div className="visual-header">
                <BarChart3 size={20} color="#667eea" />
                <span>Analytics Dashboard</span>
              </div>
              <div className="visual-body">
                <div className="visual-bars">
                  <div className="visual-bar" style={{ height: '60%', backgroundColor: '#667eea' }}></div>
                  <div className="visual-bar" style={{ height: '85%', backgroundColor: '#10b981' }}></div>
                  <div className="visual-bar" style={{ height: '45%', backgroundColor: '#f59e0b' }}></div>
                  <div className="visual-bar" style={{ height: '95%', backgroundColor: '#ef4444' }}></div>
                  <div className="visual-bar" style={{ height: '70%', backgroundColor: '#8b5cf6' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-description">
            Explore our comprehensive dashboards and start making data-driven decisions today
          </p>
          <button className="btn-cta" onClick={() => navigate('/dashboard/analytics')}>
            Unlock Insights
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}