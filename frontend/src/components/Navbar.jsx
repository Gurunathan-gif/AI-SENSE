import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Cpu, Terminal, Radio, Shield, Sparkles, Activity, Play, ShieldCheck, HelpCircle, LayoutDashboard, Code, Server } from "lucide-react";
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
                <h1 className="text-2xl font-bold text-white">AI SENSE</h1>
                <p className="text-[10px] text-gray-400">AI Powered Hardware Platform</p>
              </div>
            </Link>

            {/* Connection Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold border">
              {backendStatus === "connected" && (
                <span className="flex items-center gap-1.5 text-green-400 border-green-500/30 bg-green-500/10 px-2 py-0.5 rounded-full border">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                  <Server size={12} /> Railway API Connected
                </span>
              )}
              {backendStatus === "fallback" && (
                <span className="flex items-center gap-1.5 text-amber-400 border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded-full border">
                  <Activity size={12} /> Cloud Local Mode
                </span>
              )}
              {backendStatus === "checking" && (
                <span className="text-gray-400 border-slate-800 bg-slate-900 px-2 py-0.5 rounded-full border">
                  Checking API Connection...
                </span>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-gray-300">
            <Link to="/chat" className="hover:text-blue-400 transition">
              AI Code Studio
            </Link>
            <Link to="/run" className="hover:text-blue-400 transition">
              RUN Studio
            </Link>
            <Link to="/qc" className="hover:text-blue-400 transition">
              QC Diagnostics
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}