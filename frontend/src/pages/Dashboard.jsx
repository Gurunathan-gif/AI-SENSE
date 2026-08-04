import {
  Home, MessageSquare, Cpu, BookOpen, Terminal, Folder, Settings, LogOut,
  Bell, Search, User, Plus, Upload, Play, Bot, Activity, FlaskConical,
  ShieldCheck, Server, Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HardwareSpecs from "../components/HardwareSpecs";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-500">AI SENSE</h1>
            <p className="text-gray-400 text-xs mt-1">Arduino UNO Q Platform</p>
          </div>

          <nav className="mt-4">
            <Menu icon={<Home />} text="Dashboard" active onClick={() => navigate("/dashboard")} />
            <Menu icon={<MessageSquare />} text="AI Chat" onClick={() => navigate("/chat")} />
            <Menu icon={<Cpu />} text="Module Library" onClick={() => navigate("/modules")} />
            <Menu icon={<FlaskConical />} text="Sensor Lab (100)" onClick={() => navigate("/sensors")} />
            <Menu icon={<ShieldCheck />} text="QC Diagnostics" onClick={() => navigate("/qc")} />
            <Menu icon={<Terminal />} text="RUN Studio" onClick={() => navigate("/run")} />
            <Menu icon={<BookOpen />} text="Documentation" onClick={() => navigate("/documentation")} />
            <Menu icon={<Folder />} text="Projects" onClick={() => navigate("/projects")} />
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800">
          <button onClick={logout} className="flex items-center gap-3 text-red-400 hover:text-red-300 font-bold text-xs">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/60 backdrop-blur">
          <div className="flex items-center bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 w-96">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search 100 sensors, projects, modules..."
              className="bg-transparent outline-none ml-3 w-full text-xs font-mono"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <User className="bg-blue-600 rounded-full p-2" size={38} />
              <div>
                <h3 className="font-bold text-sm">Gurunathan</h3>
                <p className="text-xs text-blue-400 font-mono">Arduino UNO Q Developer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="p-8 space-y-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 rounded-3xl p-8 border border-blue-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-extrabold uppercase">
                🚀 Hybrid AI SBC Active
              </span>
              <h2 className="text-4xl font-extrabold text-white mt-3">Welcome to AI SENSE 👋</h2>
              <p className="mt-2 text-sm text-gray-200 max-w-xl">
                Developing for <strong>Arduino UNO Q</strong> Single Board Computer (Qualcomm Dragonwing QRB2210 + STM32U585 ARM Cortex-M33 + Debian Linux OS).
              </p>
            </div>
            <button
              onClick={() => navigate("/chat")}
              className="px-6 py-3 rounded-2xl bg-white text-blue-900 font-extrabold text-xs flex items-center gap-2 hover:bg-gray-100 transition shadow-lg"
            >
              <Zap size={16} /> Open AI Code Studio
            </button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card title="100 Sensors Lab" value="100 Active" color="text-blue-400" />
            <Card title="AI Generation" value="Google Gemini" color="text-green-400" />
            <Card title="SBC Platform" value="Arduino UNO Q" color="text-purple-400" />
            <Card title="Target MCU" value="STM32U585 M33" color="text-amber-400" />
          </div>

          {/* Arduino UNO Q Specs Widget */}
          <HardwareSpecs />

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Quick System Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Action icon={<Bot size={28} />} title="AI Code Studio" onClick={() => navigate("/chat")} />
              <Action icon={<FlaskConical size={28} />} title="100 Sensors Lab" onClick={() => navigate("/sensors")} />
              <Action icon={<ShieldCheck size={28} />} title="QC Diagnostics" onClick={() => navigate("/qc")} />
              <Action icon={<Terminal size={28} />} title="RUN Studio" onClick={() => navigate("/run")} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Menu({ icon, text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-3.5 text-xs font-bold transition ${
        active ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-gray-400 hover:text-white"
      }`}
    >
      {icon}
      {text}
    </button>
  );
}

function Card({ title, value, color }) {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
      <h3 className="text-xs font-bold text-gray-400 uppercase">{title}</h3>
      <h2 className={`text-2xl font-black mt-2 ${color}`}>{value}</h2>
    </div>
  );
}

function Action({ icon, title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-slate-900 rounded-3xl p-6 border border-slate-800 hover:border-blue-500 hover:bg-blue-600/10 transition text-left group"
    >
      <div className="text-blue-500 group-hover:text-blue-400">{icon}</div>
      <h3 className="mt-4 text-sm font-bold text-white">{title}</h3>
    </button>
  );
}