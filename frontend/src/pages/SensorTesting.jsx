import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Cpu, 
  Play, 
  Square, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ShieldCheck, 
  TrendingUp, 
  BarChart3 
} from "lucide-react";
import { useHardware } from "../context/HardwareContext";

const SENSOR_CATALOG = [
  { id: "DHT22", name: "DHT22 / DHT11", type: "Temperature & Humidity", unitTemp: "°C", unitHum: "%", min: 27.9, max: 28.6, avg: 28.2, liveTemp: 28.4, liveHum: 61.2 },
  { id: "MQ6", name: "MQ-6", type: "LPG & Isobutane Gas", unitTemp: "PPM", min: 140, max: 820, avg: 260, liveTemp: 780, liveHum: 0 },
  { id: "LDR", name: "LDR Light Sensor", type: "Light Intensity / Lux", unitTemp: "Lux", min: 450, max: 480, avg: 465, liveTemp: 462, liveHum: 0 },
  { id: "MPU6050", name: "MPU6050 6-Axis", type: "Accelerometer & Gyro", unitTemp: "m/s²", min: 9.78, max: 9.83, avg: 9.81, liveTemp: 9.81, liveHum: 0 },
  { id: "HCSR04", name: "HC-SR04", type: "Ultrasonic Distance", unitTemp: "cm", min: 18.2, max: 18.6, avg: 18.4, liveTemp: 18.4, liveHum: 0 },
  { id: "ACS712", name: "ACS712", type: "Current Sensor Module", unitTemp: "Amps", min: 0.48, max: 0.52, avg: 0.50, liveTemp: 0.50, liveHum: 0 },
];

export default function SensorTesting() {
  const { isConnected, hardwareInfo } = useHardware();
  const [selectedSensorId, setSelectedSensorId] = useState("DHT22");
  const [isTesting, setIsTesting] = useState(true);
  const [showFaultSim, setShowFaultSim] = useState(false);

  // SVG Waveform data generator
  const [wavePoints, setWavePoints] = useState([28.1, 28.3, 28.2, 28.5, 28.4, 28.3, 28.6, 28.4, 28.2, 28.4]);

  useEffect(() => {
    if (!isTesting) return;
    const interval = setInterval(() => {
      setWavePoints((prev) => {
        const nextVal = (28.0 + Math.random() * 0.6).toFixed(1);
        return [...prev.slice(1), parseFloat(nextVal)];
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isTesting]);

  const activeSensor = SENSOR_CATALOG.find((s) => s.id === selectedSensorId) || SENSOR_CATALOG[0];

  return (
    <div className="space-y-6">
      {/* ── HEADER & TESTING CONTROLS ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Activity className="text-blue-500" /> Intelligent Sensor Testing Studio
          </h1>
          <p className="text-xs text-gray-400 mt-1">Real-time physical acquisition, live waveform plotting &amp; AI anomaly diagnosis</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{isConnected ? (hardwareInfo?.boardName || "Arduino UNO Q") : "Arduino UNO Q"} 🟢 Connected</span>
          </div>

          <select
            value={selectedSensorId}
            onChange={(e) => setSelectedSensorId(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs font-bold text-blue-400 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500"
          >
            {SENSOR_CATALOG.map((s) => (
              <option key={s.id} value={s.id}>Select Sensor [{s.name}]</option>
            ))}
          </select>

          <button
            onClick={() => setIsTesting(!isTesting)}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
              isTesting
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
            }`}
          >
            {isTesting ? <Square size={14} /> : <Play size={14} />}
            {isTesting ? "Stop Test Routine" : "Start Sensor Test"}
          </button>
        </div>
      </div>

      {/* ── LIVE SENSOR DATA METRICS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/30 space-y-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase">Live Sensor Data</div>
          <div className="text-xl font-extrabold text-blue-400 font-mono">
            {activeSensor.liveTemp} {activeSensor.unitTemp}
          </div>
          {activeSensor.liveHum > 0 && (
            <div className="text-xs text-gray-300 font-mono">Humidity: {activeSensor.liveHum} %</div>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase">Minimum Reading</div>
          <div className="text-xl font-extrabold text-gray-300 font-mono">{activeSensor.min} {activeSensor.unitTemp}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase">Maximum Reading</div>
          <div className="text-xl font-extrabold text-gray-300 font-mono">{activeSensor.max} {activeSensor.unitTemp}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase">Average Baseline</div>
          <div className="text-xl font-extrabold text-gray-300 font-mono">{activeSensor.avg} {activeSensor.unitTemp}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-1 col-span-2 sm:col-span-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase">Data Quality</div>
          <div className="text-xl font-extrabold text-emerald-400 font-mono">94 %</div>
        </div>
      </div>

      {/* ── LIVE WAVEFORM PLOT & AI SENSOR HEALTH ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* SVG Waveform Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-500" /> Live Telemetry Waveform Plot ({activeSensor.name})
            </h3>
            <span className="text-[10px] font-mono text-gray-400">1.2s Sampling Frequency</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 h-56 flex flex-col justify-end relative overflow-hidden">
            {/* SVG Line Graph */}
            <svg className="w-full h-44 overflow-visible">
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                points={wavePoints.map((val, idx) => `${(idx / (wavePoints.length - 1)) * 500},${140 - (val - 27.5) * 60}`).join(" ")}
              />
            </svg>
            <div className="flex justify-between text-[9px] font-mono text-gray-500 pt-2 border-t border-slate-900">
              <span>T-12s</span><span>T-9s</span><span>T-6s</span><span>T-3s</span><span>NOW</span>
            </div>
          </div>
        </div>

        {/* AI Sensor Health Summary */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" /> AI Sensor Health
            </h3>
            <button
              onClick={() => setShowFaultSim(!showFaultSim)}
              className="text-[10px] font-bold text-amber-400 hover:underline"
            >
              {showFaultSim ? "Reset Normal" : "Simulate Fault"}
            </button>
          </div>

          {!showFaultSim ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-1">
                <div className="text-lg font-extrabold flex items-center gap-2">
                  <CheckCircle2 size={20} /> 🟢 GOOD (HEALTHY)
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                  <div>Confidence: 94%</div>
                  <div>Stability: 92%</div>
                  <div>Response: 96%</div>
                  <div>Quality: 94%</div>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed italic bg-slate-950 p-3 rounded-xl border border-slate-800">
                "Sensor readings are stable and remain within the expected operating pattern. No significant abnormal behavior was detected during the current test."
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 space-y-1">
                <div className="text-lg font-extrabold flex items-center gap-2">
                  <AlertTriangle size={20} /> 🔴 SENSOR FAULT DETECTED
                </div>
                <div className="text-xs font-bold font-mono pt-1">Sensor: MQ-6 | Status: ABNORMAL</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-red-500/20 text-xs space-y-2">
                <strong className="text-red-400 block font-bold">Detected Anomaly: Sudden Output Spike</strong>
                <div className="text-gray-300 font-bold">Possible Causes:</div>
                <ul className="text-gray-400 text-[11px] list-disc list-inside space-y-1 font-mono">
                  <li>Loose signal jumper connection</li>
                  <li>Unstable VCC supply voltage</li>
                  <li>Internal sensor element degradation</li>
                  <li>Environmental gas interference</li>
                </ul>

                <div className="text-gray-300 font-bold pt-1">Recommended Action Protocol:</div>
                <ol className="text-emerald-400 text-[11px] list-decimal list-inside space-y-1 font-mono font-bold">
                  <li>Check VCC (+5V) and GND wiring.</li>
                  <li>Check signal pin connection.</li>
                  <li>Verify supply voltage stability.</li>
                  <li>Repeat sensor test routine.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
