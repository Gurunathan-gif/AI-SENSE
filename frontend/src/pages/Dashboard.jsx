import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Activity, 
  ShieldCheck, 
  MessageSquare, 
  Code, 
  Cpu, 
  Radio, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  BarChart3, 
  FolderGit2, 
  Zap 
} from "lucide-react";
import { useHardware } from "../context/HardwareContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isConnected, hardwareInfo } = useHardware();

  const sensorHealthList = [
    { name: "DHT22", type: "Temperature & Humidity", status: "Good", healthScore: 94, iconColor: "text-emerald-400", badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
    { name: "MQ-6", type: "LPG Gas Sensor", status: "Warning", healthScore: 78, iconColor: "text-amber-400", badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
    { name: "LDR", type: "Light Intensity Sensor", status: "Good", healthScore: 97, iconColor: "text-emerald-400", badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
    { name: "MPU6050", type: "6-Axis Gyro & Accel", status: "Good", healthScore: 91, iconColor: "text-emerald-400", badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  ];

  return (
    <div className="space-y-6">
      {/* ── 1. HEADER ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Cpu className="text-blue-500" /> AI SENSE Hardware Dashboard
          </h1>
          <p className="text-xs text-gray-400 mt-1">Real-Time Sensor Monitoring, Hardware Diagnostics &amp; Edge AI Engine</p>
        </div>

        {/* Board Status Pill */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs font-bold text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{isConnected ? (hardwareInfo?.boardName || "Arduino UNO Q") : "Arduino UNO Q"} 🟢 Connected</span>
        </div>
      </div>

      {/* ── 2. TOP HARDWARE KPI CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-400 font-bold">
            <span>Projects</span>
            <FolderGit2 size={16} className="text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">12</div>
          <p className="text-[10px] text-gray-500">Active hardware workspaces</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-400 font-bold">
            <span>Sensors</span>
            <Activity size={16} className="text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">6</div>
          <p className="text-[10px] text-gray-500">Connected pin modules</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-400 font-bold">
            <span>Tests</span>
            <BarChart3 size={16} className="text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">48</div>
          <p className="text-[10px] text-gray-500">Diagnostic routines run</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-400 font-bold">
            <span>Health</span>
            <ShieldCheck size={16} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">92%</div>
          <p className="text-[10px] text-emerald-500 font-bold">Overall System Baseline</p>
        </div>
      </div>

      {/* ── 3. MAIN DASHBOARD QUICK ACTIONS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => navigate("/testing")}
          className="p-4 rounded-2xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center justify-between transition group"
        >
          <span className="flex items-center gap-2">
            <Activity size={18} /> 🔬 Test Sensor
          </span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => navigate("/diagnostics")}
          className="p-4 rounded-2xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-between transition group"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck size={18} /> 🩺 Diagnose Hardware
          </span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => navigate("/chat")}
          className="p-4 rounded-2xl bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-400 font-bold text-xs flex items-center justify-between transition group"
        >
          <span className="flex items-center gap-2">
            <MessageSquare size={18} /> 🤖 Ask AI
          </span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => navigate("/chat")}
          className="p-4 rounded-2xl bg-amber-600/10 hover:bg-amber-600/20 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center justify-between transition group"
        >
          <span className="flex items-center gap-2">
            <Code size={18} /> 💻 Generate Code
          </span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
        </button>
      </div>

      {/* ── 4. SENSOR HEALTH MATRIX & DIAGNOSTICS TIMELINE ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Sensor Health Overview */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Activity size={16} className="text-blue-500" /> Sensor Health Overview
            </h3>
            <Link to="/testing" className="text-xs text-blue-400 hover:underline font-bold">
              Run Full Test Suite &rarr;
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {sensorHealthList.map((s, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-white">{s.name}</h4>
                  <p className="text-[10px] text-gray-400">{s.type}</p>
                  <div className="text-xs font-bold text-emerald-400 mt-1">Health: {s.healthScore}%</div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${s.badgeClass}`}>
                  🟢 {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Diagnostics Timeline */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Clock size={16} className="text-purple-500" /> Recent Diagnostics
            </h3>
            <Link to="/diagnostics" className="text-xs text-purple-400 hover:underline font-bold">
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 flex items-start gap-3 text-xs">
              <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={16} />
              <div>
                <strong className="text-white block">MQ-6 Sensor Warning</strong>
                <span className="text-[10px] text-gray-400">Increased variance detected • 2 mins ago</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-start gap-3 text-xs">
              <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={16} />
              <div>
                <strong className="text-white block">DHT22 Healthy</strong>
                <span className="text-[10px] text-gray-400">Temp: 28.4 °C | Hum: 61.2% • 10 mins ago</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-start gap-3 text-xs">
              <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={16} />
              <div>
                <strong className="text-white block">MPU6050 Motion Normal</strong>
                <span className="text-[10px] text-gray-400">Zero offset steady • 25 mins ago</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}