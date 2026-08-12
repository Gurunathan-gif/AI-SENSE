import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AIChat from "./pages/AIChat";
import Modules from "./pages/Modules";
import SensorLab from "./pages/SensorLab";
import QualityCheck from "./pages/QualityCheck";
import Run from "./pages/Run";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/Notfound";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import Projects from "./pages/Projects";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/sensors" element={<SensorLab />} />
          <Route path="/qc" element={<QualityCheck />} />
          <Route path="/run" element={<Run />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;