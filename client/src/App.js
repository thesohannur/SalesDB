import React, { useState } from "react";
import DailySalesChart from "./components/DailySalesChart";
import QuantitySoldDashboard from "./components/QuantitySoldDashboard"; // Capitalized

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div style={{ width: "90%", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>SalesDB App</h1>

      <section style={{ marginBottom: "50px" }}>
        <h2>Daily Sales Chart</h2>
        <DailySalesChart />
      </section>

      <section style={{ marginBottom: "50px", paddingTop: "20px" }}>
         <h2>Quantity Sold Dashboard</h2>
        <QuantitySoldDashboard /> 
      </section>
    </div>
  );
}

export default App;
