import React, { useState } from "react";
import DailySalesChart from "./components/DailySalesChart";
import QuantitySoldDashboard from "./components/QuantitySoldDashboard"; 
import RevenuePerProductChartPerProduct from "./components/RevenueDashboardPerProduct";
import RevenuePerProductChartPerSeller from "./components/RevenuePerSeller";
import RevenuePerCategoryDashboard from "./components/RevenuePerCategory";

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div style={{ width: "90%", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>SalesDB App</h1>

      <section style={{ marginBottom: "50px" }}>
        <DailySalesChart />
      </section>

      <section style={{ marginBottom: "50px", paddingTop: "20px" }}>
        <QuantitySoldDashboard /> 
      </section>

      <section style={{ marginBottom: "50px", paddingTop: "20px" }}>
        <RevenuePerProductChartPerProduct /> 
      </section>

      <section style={{ marginBottom: "50px", paddingTop: "20px" }}>
        <RevenuePerProductChartPerSeller /> 
      </section>

      <section style={{ marginBottom: "50px", paddingTop: "20px" }}>
        <RevenuePerCategoryDashboard /> 
      </section>
    </div>
  );
}

export default App;
