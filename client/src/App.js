import React, { useState } from "react";
import UserList from "./components/UserList";

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <h1>SalesDB App</h1>
      <UserList key={refresh} />
    </div>
  );
}

export default App;
