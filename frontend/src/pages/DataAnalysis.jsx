import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Layers 
} from "lucide-react";

export default function DataAnalysis() {
  const comparisonList = [
    { sensor: "DHT22", type: "Temperature & Humidity", health: 94, status: "Good", badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
    { sensor: "MQ-6", type: "LPG Gas Sensor", health: 78, status: "Warning", badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
    { sensor: "LDR", type: "Light Intensity", health: 97, status: "Good", badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
    { sensor: "MPU6050", type: "6-Axis Motion", health: 91, status: "Good", badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  ];

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="text-purple-400" /> Sensor Data Analytics
          </h1>
          <p className="text-xs text-gray-400 mt-1">Statistical analysis, variance tracking, outlier detection &amp; multi-sensor health comparative matrix</p>
        </div>
        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full border border-purple-500/30">
          1,250 Samples Evaluated
        </span>
      </div>

      {/* ── STATISTICAL SUMMARY CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[10px] text-gray-400 font-bold uppercase">Samples</div>
          <div className="text-xl font-extrabold text-white font-mono">1,250</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[10px] text-gray-400 font-bold uppercase">Average</div>
          <div className="text-xl font-extrabold text-blue-400 font-mono">28.32</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[10px] text-gray-400 font-bold uppercase">Minimum</div>
          <div className="text-xl font-extrabold text-gray-300 font-mono">27.91</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[10px] text-gray-400 font-bold uppercase">Maximum</div>
          <div className="text-xl font-extrabold text-gray-300 font-mono">28.74</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[10px] text-gray-400 font-bold uppercase">Std. Dev.</div>
          <div className="text-xl font-extrabold text-indigo-400 font-mono">0.21</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 space-y-1">
          <div className="text-[10px] text-gray-400 font-bold uppercase">Outliers</div>
          <div className="text-xl font-extrabold text-amber-400 font-mono">3</div>
        </div>
      </div>

      {/* ── REAL-TIME ANALYTICS PLOT & COMPARISON ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Real-time Waveform Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-500" /> Sensor Signal &amp; Anomaly Points (DHT22 Baseline)
            </h3>
            <span className="text-[10px] font-mono text-gray-400">Baseline Std Dev Range: 0.21</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 h-60 flex flex-col justify-between relative overflow-hidden">
            {/* SVG Plot with Anomaly Markers */}
            <svg className="w-full h-44 overflow-visible">
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                points="0,110 50,105 100,115 150,40 200,112 250,108 300,160 350,110 400,106 450,45 500,110"
              />
              {/* Anomaly Outlier Markers */}
              <circle cx="150" cy="40" r="5" fill="#f59e0b" />
              <circle cx="300" cy="160" r="5" fill="#ef4444" />
              <circle cx="450" cy="45" r="5" fill="#f59e0b" />
            </svg>
            <div className="flex justify-between text-[9px] font-mono text-gray-500 pt-2 border-t border-slate-900">
              <span>0s</span><span>250s</span><span>500s</span><span>750s</span><span>1250s</span>
            </div>
          </div>
        </div>

        {/* Multi-Sensor Comparative Health Matrix */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Layers size={16} className="text-purple-400" /> Multi-Sensor Health Matrix
            </h3>
          </div>

          <div className="space-y-3">
            {comparisonList.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-extrabold text-white">{item.sensor}</div>
                  <div className="text-[10px] text-gray-400">{item.type}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs font-mono font-bold text-white">{item.health}%</div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${item.badgeClass}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
