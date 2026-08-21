import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Cpu, Server, Activity } from "lucide-react";
import { useHardware } from "../context/HardwareContext";

export default function Navbar() {
  const location = useLocation();
  const { backendStatus } = useHardware();

  return (
    <nav className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
                <Cpu className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-wide">AI SENSE</h1>
                <p className="text-[10px] text-gray-400">AI-Powered Hardware &amp; Sensor Platform</p>
              </div>
            </Link>

            {/* Connection Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold border">
              {backendStatus === "connected" && (
                <span className="flex items-center gap-1.5 text-green-400 border-green-500/30 bg-green-500/10 px-2.5 py-0.5 rounded-full border">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                  <Server size={12} /> Vercel API Connected
                </span>
              )}
              {backendStatus === "fallback" && (
                <span className="flex items-center gap-1.5 text-amber-400 border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 rounded-full border">
                  <Activity size={12} /> Local Mode
                </span>
              )}
            </div>
          </div>

          {/* Top Quick Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-gray-300">
            <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
            <Link to="/testing" className="hover:text-blue-400 transition">Sensor Testing</Link>
            <Link to="/diagnostics" className="hover:text-blue-400 transition">Diagnostics</Link>
            <Link to="/chat" className="hover:text-blue-400 transition">AI Assistant</Link>
            <Link to="/run" className="hover:text-blue-400 transition">RUN Studio</Link>
            <Link to="/analytics" className="hover:text-blue-400 transition">Analytics</Link>
          </div>

        </div>
      </div>
    </nav>
  );
}