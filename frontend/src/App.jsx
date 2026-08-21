import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { HardwareProvider } from "./context/HardwareContext";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SensorTesting from "./pages/SensorTesting";
import Diagnostics from "./pages/Diagnostics";
import AIChat from "./pages/AIChat";
import Modules from "./pages/Modules";
import Run from "./pages/Run";
import DataAnalysis from "./pages/DataAnalysis";
import Projects from "./pages/Projects";
import Documentation from "./pages/Documentation";
import SettingsPage from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/Notfound";

function App() {
  return (
    <BrowserRouter>
      <HardwareProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/testing" element={<SensorTesting />} />
            <Route path="/sensors" element={<SensorTesting />} />
            <Route path="/diagnostics" element={<Diagnostics />} />
            <Route path="/qc" element={<Diagnostics />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/run" element={<Run />} />
            <Route path="/analytics" element={<DataAnalysis />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </HardwareProvider>
    </BrowserRouter>
  );
}

export default App;