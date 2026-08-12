import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Cpu, 
  LayoutDashboard, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Layers, 
  FolderGit2, 
  BookOpen, 
  Settings, 
  User, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Server,
  Zap,
  Radio
} from "lucide-react";
import api from "../api/api";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    let isMounted = true;
    api.get("/")
      .then(() => {
        if (isMounted) setBackendStatus("connected");
      })
      .catch(() => {
        if (isMounted) setBackendStatus("fallback");
      });
    return () => { isMounted = false; };
  }, []);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", badge: null },
    { label: "AI Code Studio", icon: Sparkles, path: "/chat", badge: "Gemini" },
    { label: "RUN Studio & Hardware", icon: Activity, path: "/run", badge: "Live" },
    { label: "QC Diagnostics", icon: ShieldCheck, path: "/qc", badge: "QC" },
    { label: "100 Sensor Library", icon: Layers, path: "/sensors", badge: "100" },
    { label: "Cloud Projects", icon: FolderGit2, path: "/projects", badge: null },
    { label: "Arduino UNO Q Docs", icon: BookOpen, path: "/documentation", badge: null },
  ];

  const secondaryItems = [
    { label: "Settings", icon: Settings, path: "/settings" },
    { label: "My Profile", icon: User, path: "/profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully.");
    navigate("/login");
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-slate-950 border-r border-slate-800/80 z-40 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Top Header & Logo */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800/60">
        <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Cpu className="text-blue-500" size={24} />
          </div>
          {!collapsed && (
            <div className="truncate">
              <h1 className="text-lg font-bold text-white tracking-wide">AI SENSE</h1>
              <p className="text-[10px] font-semibold text-blue-400">UNO Q Dual-Core SBC</p>
            </div>
          )}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-gray-400 hover:text-white transition"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-2">
              Main Workspace
            </div>
          )}
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/5"
                    : "text-gray-400 hover:text-white hover:bg-slate-900 border border-transparent"
                }`}
                title={collapsed ? item.label : ""}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    size={20}
                    className={`shrink-0 transition ${
                      isActive ? "text-blue-400" : "text-gray-500 group-hover:text-white"
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full border ${
                      isActive
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                        : "bg-slate-900 text-gray-400 border-slate-800"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Secondary System Options */}
        <div className="space-y-1 pt-4 border-t border-slate-900">
          {!collapsed && (
            <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-2">
              System Settings
            </div>
          )}
          {secondaryItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/30"
                    : "text-gray-400 hover:text-white hover:bg-slate-900 border border-transparent"
                }`}
                title={collapsed ? item.label : ""}
              >
                <Icon size={18} className="shrink-0 text-gray-500" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer & Connection Status Pill */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
        {!collapsed && (
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Radio size={12} className="text-blue-500" /> Render API
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                  backendStatus === "connected"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                }`}
              >
                {backendStatus === "connected" ? "Connected" : "Local Mode"}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 text-xs font-bold transition"
          title="Sign Out"
        >
          <LogOut size={16} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
