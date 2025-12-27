import React, { useState } from "react";
import DailySalesChart from "./components/DailySalesChart";

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <h1>SalesDB App</h1>
      <DailySalesChart />
    </div>
  );
}

export default App;
