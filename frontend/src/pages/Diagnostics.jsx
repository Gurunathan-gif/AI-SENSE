import React from "react";
import { 
  ShieldCheck, 
  Cpu, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  RefreshCw, 
  ArrowRight 
} from "lucide-react";
import { useHardware } from "../context/HardwareContext";
import { Link } from "react-router-dom";

export default function Diagnostics() {
  const { isConnected, hardwareInfo } = useHardware();

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" /> Hardware Diagnostics Center
          </h1>
          <p className="text-xs text-gray-400 mt-1">Deep hardware health assessment, communication fidelity, stability &amp; AI anomaly detection</p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs font-bold text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{isConnected ? (hardwareInfo?.boardName || "Arduino UNO Q") : "Arduino UNO Q"} 🟢 Connected</span>
        </div>
      </div>

      {/* ── DIAGNOSTIC REPORT CARD ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Hardware Health Metrics */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Cpu size={16} className="text-blue-500" /> System Hardware Report
            </h3>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              Overall Health: 🟡 WARNING
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-gray-400 uppercase text-[10px] font-bold">Target Microcontroller</div>
              <div className="text-sm font-extrabold text-white">Arduino UNO Q (Official Zephyr RTOS)</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-gray-400 uppercase text-[10px] font-bold">Active Diagnostic Sensor</div>
              <div className="text-sm font-extrabold text-amber-400">MQ-6 Gas Sensor</div>
            </div>
          </div>

          {/* Metrics Bars */}
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-300">Communication Fidelity</span>
                <span className="text-emerald-400 font-mono">100 %</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-emerald-500 w-[100%]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-300">Data Stability Index</span>
                <span className="text-amber-400 font-mono">87 %</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-amber-500 w-[87%]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-300">Transient Response Speed</span>
                <span className="text-emerald-400 font-mono">91 %</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-emerald-500 w-[91%]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-300">Signal Data Quality</span>
                <span className="text-emerald-400 font-mono">89 %</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-emerald-500 w-[89%]" />
              </div>
            </div>
          </div>
        </div>

        {/* AI Diagnosis & Recommendation */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-extrabold text-white border-b border-slate-800 pb-3">
              <Wrench size={18} className="text-amber-400" /> AI Hardware Diagnosis
            </div>

            <p className="text-xs text-gray-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              "The sensor is functioning but its readings show increased variation compared with the normal baseline. This may indicate unstable power, environmental interference or sensor aging."
            </p>

            <div className="space-y-2">
              <strong className="text-xs text-emerald-400 block font-bold">Recommended Action:</strong>
              <p className="text-xs text-gray-400 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
                Check the sensor power supply and connections, allow adequate warm-up time, and repeat the test.
              </p>
            </div>
          </div>

          <Link
            to="/testing"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
          >
            <Activity size={16} /> Re-Run Sensor Testing Protocol <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
}
