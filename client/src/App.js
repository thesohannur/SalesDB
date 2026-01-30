import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPageView from "./pages/LandingPageView";
import DashboardLayout from "./components/Layout/DashboardLayout";
import OverviewPage from "./pages/OverviewPage";
import IntegrityPage from "./pages/IntegrityPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import InactiveSellersPage from "./pages/InactiveSellersPage";
import AdminPage from "./pages/AdminPage";

//Analytics Page
import CoreTransactionalPage from "./pages/analyticsSubPages/CoreTransactionalPage";
import TimeCustomerPage from "./pages/analyticsSubPages/TimeCustomerPage"
//Dashboard
import DailySalesDashboard from "./components/DailySalesChart";
import QuantitySoldDashboard from './components/QuantitySoldDashboard';
import RevenuePerProductDashboard from './components/RevenueDashboardPerProduct'
import RevenuePerSellerDashboard from './components/RevenuePerSeller'
import RevenuePerCategoryDashboard from './components/RevenuePerCategory'
import MonthlyRevenuePerYear from './components/Phase3_Dashboard/MonthlyRevenuePerYear'
import MonthlySalesTrend from './components/Phase3_Dashboard/MonthlySalesTrend'
import CLTVDashboard from './components/Phase3_Dashboard/CLTVDashboard'
import MonthlyOrderCount from './components/Phase3_Dashboard/MonthlyOrderCount'
import AOVDashboard from './components/Phase3_Dashboard/AOVDashboard'
import ReturnsPage from "./pages/ReturnsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPageView />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="integrity" element={<IntegrityPage />} />
         
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="analytics/core-transactional" element={<CoreTransactionalPage />} />
          <Route path="analytics/time-customer" element={<TimeCustomerPage />} />
          
          {/* Phase 2 */}
          <Route path="analytics/core-transactional/daily-sales-chart" element={<DailySalesDashboard />} />
          <Route path="analytics/core-transactional/quantity-sold-dashboard" element={<QuantitySoldDashboard />} />
          <Route path="analytics/core-transactional/revenue-per-product-dashboard" element={<RevenuePerProductDashboard />} />
          <Route path="analytics/core-transactional/revenue-per-seller-dashboard" element={<RevenuePerSellerDashboard />} />
          <Route path="analytics/core-transactional/revenue-per-category-dashboard" element={<RevenuePerCategoryDashboard />} />

          {/* Phase 3 */}
          <Route path="analytics/core-transactional/monthly-revenue-per-year" element={<MonthlyRevenuePerYear />} />
          <Route path="analytics/core-transactional/monthly-sales-trend" element={<MonthlySalesTrend />} />
          <Route path="analytics/core-transactional/monthly-order-count" element={<MonthlyOrderCount />} />
          <Route path="analytics/core-transactional/cltv-dashboard" element={<CLTVDashboard />} />
          <Route path="analytics/core-transactional/aov-dashboard" element={<AOVDashboard />} />

          {/* Phase 4 */}
          <Route path="analytics/inactive-sellers-page" element={<InactiveSellersPage />} />

          {/* Phase 5 */}
          <Route path="analytics/return" element={<ReturnsPage />} />

          <Route path="inactive-sellers" element={<InactiveSellersPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
