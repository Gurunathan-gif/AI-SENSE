import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cpu, Activity, Server } from "lucide-react";
import api from "../api/api";

export default function Navbar() {
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

  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

        {/* Logo & Connection Badge */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <Cpu size={36} className="text-blue-500" />
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
                <Server size={12} /> Render API Connected
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
          <Link to="/sensors" className="hover:text-blue-400 transition">
            Sensor Lab (100)
          </Link>
          <Link to="/qc" className="hover:text-blue-400 transition font-bold text-blue-400">
            QC Diagnostics
          </Link>
          <Link to="/modules" className="hover:text-blue-400 transition">
            Modules
          </Link>
          <Link to="/run" className="hover:text-blue-400 transition">
            Hardware Monitor
          </Link>
          <Link to="/documentation" className="hover:text-blue-400 transition">
            Docs
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link to="/login">
            <button className="px-4 py-2 rounded-xl border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition text-xs font-bold">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition text-xs font-bold">
              Get Started
            </button>
          </Link>
        </div>

      </div>
    </nav>
  );
}