import { useState } from "react";
import "./App.css";

import Billing from "./Pages/Billing";
import Dashboard from "./Pages/Dashboard";
import Maintenance from "./Pages/Maintenance";
import Notices from "./Pages/Notices";
import Residents from "./Pages/Residents";

import Sidebar from "./Components/Sidebar";
import { useApp, AppProvider } from "./Context/AppContext";

function MainApp() {
  const { state } = useApp();

  const components = {
    dashboard: <Dashboard />,
    billing: <Billing />,
    notices: <Notices />,
    residents: <Residents />,
    maintenance: <Maintenance />,
  };

  return (
    <div className="flex min-h-screen">
      {/** Sidebar Content */}
      <div className="w-64 bg-gray-800 text-white">
        <Sidebar></Sidebar>
      </div>

      {/** Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {components[state.activeSection] || <Dashboard />}
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
