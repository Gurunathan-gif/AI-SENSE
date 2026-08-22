import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home as HomeIcon, 
  LayoutDashboard, 
  Activity, 
  ShieldCheck, 
  MessageSquare, 
  Layers, 
  Play, 
  BarChart3, 
  FolderGit2, 
  BookOpen, 
  Settings, 
  LogOut, 
  Radio, 
  Cpu, 
  Terminal 
} from "lucide-react";
import { useHardware } from "../context/HardwareContext";

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { backendStatus, toggleBackendMode } = useHardware();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { label: "Home", path: "/", icon: HomeIcon },
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Sensor Testing", path: "/testing", icon: Activity },
    { label: "Diagnostics", path: "/diagnostics", icon: ShieldCheck },
    { label: "AI Assistant", path: "/chat", icon: MessageSquare },
    { label: "Module Library", path: "/modules", icon: Layers },
    { label: "RUN Studio", path: "/run", icon: Play },
    { label: "Data Analysis", path: "/analytics", icon: BarChart3 },
    { label: "Projects", path: "/projects", icon: FolderGit2 },
    { label: "Documentation", path: "/documentation", icon: BookOpen },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside className={`bg-slate-950 border-r border-slate-800/80 flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600 shadow-md shadow-blue-600/30">
              <Cpu className="text-white" size={18} />
            </div>
            <div>
              <span className="font-bold text-sm text-white tracking-wide block leading-none">AI SENSE</span>
              <span className="text-[9px] text-blue-400 font-semibold tracking-wider">LOCAL HARDWARE</span>
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-900 text-gray-400 hover:text-white transition"
        >
          <Terminal size={16} />
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-gray-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Footer & Interactive Connection Status Pill */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
        {!collapsed && (
          <div 
            onClick={toggleBackendMode}
            title="Click to toggle connection mode"
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-2 cursor-pointer hover:border-blue-500/40 transition"
          >
            <div className="flex items-center justify-between font-bold">
              <span className="text-gray-300 flex items-center gap-1.5">
                <Radio size={12} className={backendStatus === "connected" ? "text-emerald-400 animate-pulse" : "text-amber-400"} /> Local API
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border transition ${
                  backendStatus === "connected"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                }`}
              >
                {backendStatus === "connected" ? "Port 10000" : "Local Mode"}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 text-xs font-bold transition"
        >
          <LogOut size={16} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
