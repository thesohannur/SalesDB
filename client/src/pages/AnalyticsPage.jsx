import React from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  BarChart3,
  AlertCircle,
  Settings,
} from "lucide-react";
import "../components/styles/AnalyticsPages.css";

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSubPage = location.pathname !== "/dashboard/analytics";

  const categories = [
    {
      icon: BarChart3,
      title: "Core Transactional Analytics",
      description: "Reliable aggregations built on transactional data",
      color: "#667eea",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      path: "/dashboard/analytics/core-transactional",
      badge: "5 Dashboards",
    },
    {
      icon: TrendingUp,
      title: "Time & Customer Intelligence",
      description: "Behavioral and longitudinal insights",
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      path: "/time-customer",
      badge: "5 Dashboards",
    },
    {
      icon: Users,
      title: "Seller & Operational Health",
      description: "Supply-side performance and activity monitoring",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      path: "/seller-operational",
      badge: "Coming Soon",
    },
    {
      icon: AlertCircle,
      title: "Returns, Risk & Quality Control",
      description: "Loss prevention and risk monitoring",
      color: "#ef4444",
      gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      path: "/returns-risk",
      badge: "Coming Soon",
    },
    {
      icon: Package,
      title: "Inventory Intelligence",
      description: "Stock health and supply risk",
      color: "#8b5cf6",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      path: "/inventory",
      badge: "Coming Soon",
    },
    {
      icon: DollarSign,
      title: "Profit & Financial Intelligence",
      description: "True business profitability beyond revenue",
      color: "#ec4899",
      gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
      path: "/profit-financial",
      badge: "Coming Soon",
    },
    {
      icon: Settings,
      title: "Automation & Data Integrity",
      description: "Backend intelligence and automation",
      color: "#06b6d4",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      path: "/automation",
      badge: "Coming Soon",
    },
    {
      icon: ShoppingCart,
      title: "Advanced Intelligence",
      description: "High-impact, deep-level analytics",
      color: "#f97316",
      gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
      path: "/advanced",
      badge: "Coming Soon",
    },
  ];

  return (
    <div className="analytics-home-container">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <h1 className="analytics-main-title">
            Business Intelligence Dashboard
          </h1>
          <p className="analytics-subtitle">
            Comprehensive analytics and insights for data-driven decisions
          </p>
        </div>
        <div className="analytics-stats">
          <div className="stat-item">
            <span className="stat-value">10</span>
            <span className="stat-label">Active Dashboards</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">8</span>
            <span className="stat-label">Categories</span>
          </div>
        </div>
      </div>

      {!isSubPage && (
        <div className="categories-grid">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isComingSoon = category.badge === "Coming Soon";

            return (
              <div
                key={index}
                className={`category-card ${isComingSoon ? "coming-soon" : ""}`}
                onClick={() => !isComingSoon && navigate(category.path)}
              >
                <div
                  className="category-icon"
                  style={{ background: category.gradient }}
                >
                  <Icon size={28} color="white" />
                </div>

                <div className="category-content">
                  <div className="category-header">
                    <h3 className="category-title">{category.title}</h3>
                    <span
                      className={`category-badge ${
                        isComingSoon ? "badge-coming-soon" : "badge-active"
                      }`}
                    >
                      {category.badge}
                    </span>
                  </div>
                  <p className="category-description">{category.description}</p>
                </div>

                {!isComingSoon && (
                  <div className="category-arrow">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path
                        d="M7.5 15L12.5 10L7.5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {isSubPage && <Outlet />}
    </div>
  );
}
