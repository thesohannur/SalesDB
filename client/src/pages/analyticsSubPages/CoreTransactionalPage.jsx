import React from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Package,
  DollarSign,
  Users,
  Layers,
} from "lucide-react";
import "../../components/styles/AnalyticsPages.css";

export default function CoreTransactionalPage() {
  const navigate = useNavigate();

  const dashboards = [
    {
      icon: Calendar,
      title: "Daily Sales Dashboard",
      description: "Track day-to-day business activity and sales movement",
      features: [
        "Total Sales, Orders, Items",
        "Average Daily Sales",
        "Daily Sales Trend",
        "Orders & Items Sold Trends",
      ],
      color: "#667eea",
      path: "daily-sales-chart",
    },
    {
      icon: Package,
      title: "Quantity Sold Dashboard",
      description: "Analyze product demand and sales volume across dimensions",
      features: [
        "Per Product (Top sellers)",
        "Per Year",
        "Per Category",
        "Per Category & Year",
      ],
      color: "#10b981",
      path: "/dashboard/quantity-sold",
    },
    {
      icon: DollarSign,
      title: "Revenue per Product",
      description: "Evaluate how individual products contribute to revenue",
      features: [
        "Revenue ranking",
        "Revenue share %",
        "Average revenue per product",
        "Top performers",
      ],
      color: "#f59e0b",
      path: "/dashboard/revenue-per-product",
    },
    {
      icon: Users,
      title: "Revenue per Seller",
      description: "Measure seller-level performance and revenue contribution",
      features: [
        "Revenue by seller",
        "Products sold per seller",
        "Seller ranking",
        "Performance metrics",
      ],
      color: "#ef4444",
      path: "/dashboard/revenue-per-seller",
    },
    {
      icon: Layers,
      title: "Revenue per Category",
      description: "Category-level view of revenue and product movement",
      features: [
        "Revenue distribution",
        "Products sold distribution",
        "Category revenue share",
        "Performance analysis",
      ],
      color: "#8b5cf6",
      path: "/dashboard/revenue-per-category",
    },
  ];

  return (
    <div className="analytics-home-container">
      {/* Back Button */}
      <button
        className="back-button"
        onClick={() => navigate("/dashboard/analytics")}
      >
        <ArrowLeft size={20} />
        <span>Back to Analytics Home</span>
      </button>

      {/* Header */}
      <div className="analytics-header">
        <div>
          <h1 className="analytics-main-title">Core Transactional Analytics</h1>
          <p className="analytics-subtitle">
            Reliable aggregations built on clean transactional data
          </p>
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
                <div
                  className="dashboard-icon"
                  style={{ backgroundColor: `${dashboard.color}15` }}
                >
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
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M13.3334 4L6.00002 11.3333L2.66669 8"
                            stroke={dashboard.color}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="dashboard-footer">
                <button
                  className="view-dashboard-btn"
                  style={{ color: dashboard.color }}
                >
                  View Dashboard
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
          
        })}
      </div>
      <Outlet />
    </div>
  );
}
