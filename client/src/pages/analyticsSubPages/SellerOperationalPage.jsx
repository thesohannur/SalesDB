import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../../components/styles/AnalyticsPages.css';

export default function SellerOperationalPage() {
  const navigate = useNavigate();

  return (
    <div className="analytics-home-container">
      <button className="back-button" onClick={() => navigate('/')}>
        <ArrowLeft size={20} />
        <span>Back to Analytics Home</span>
      </button>

      <div className="analytics-header">
        <div>
          <h1 className="analytics-main-title">Seller & Operational Health</h1>
          <p className="analytics-subtitle">Supply-side performance and activity monitoring</p>
        </div>
        <div className="category-badge-large badge-coming-soon">
          Coming Soon
        </div>
      </div>

      <div className="coming-soon-container">
        <div className="coming-soon-content">
          <h2>🚧 Under Development</h2>
          <p>This section is currently being built and will be available soon.</p>
        </div>
      </div>
    </div>
  );
}