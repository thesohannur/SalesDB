import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPageView from "./pages/LandingPageView";
import DashboardLayout from "./components/Layout/DashboardLayout";
import OverviewPage from "./pages/OverviewPage";
import IntegrityPage from "./pages/IntegrityPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import RankingsPage from "./pages/RankingsPage";
import ReturnsPage from "./pages/ReturnsPage";
import InactiveSellersPage from "./pages/InactiveSellersPage";
import AdminPage from "./pages/AdminPage";

//Analytics Page
import CoreTransactionalPage from "./pages/analyticsSubPages/CoreTransactionalPage";
import DailySalesDashboard from "./components/DailySalesChart";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPageView />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="integrity" element={<IntegrityPage />} />
          <Route path="analytics" element={<AnalyticsPage />}>
            <Route path="core-transactional" element={<CoreTransactionalPage />}>
              <Route path="daily-sales-chart" element={<DailySalesDashboard />}> </Route>
            </Route>
          </Route>

          <Route path="rankings" element={<RankingsPage />} />
          <Route path="returns" element={<ReturnsPage />} />
          <Route path="inactive-sellers" element={<InactiveSellersPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
