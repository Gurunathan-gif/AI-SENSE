import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, RefreshCw, Activity, Cpu, Wrench, Usb, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHardware } from '../context/HardwareContext';
import { analyzeQCSignalsWithGemini } from '../services/aiService';

const SENSOR_QC_PROFILES = [
  {
    id: 'tcs3200',
    name: 'TCS3200 Color Sensor',
    paramKeys: ['RED', 'GREEN', 'BLUE'],
    voltage: '2.7V - 5.5V DC',
    interface: 'Digital Frequency Pulse',
    defaultOutputs: [
      { param: 'Red Channel Pulse', nominal: '25µs - 120µs', tolerance: '±5%' },
      { param: 'Green Channel Pulse', nominal: '30µs - 140µs', tolerance: '±5%' },
      { param: 'Blue Channel Pulse', nominal: '25µs - 110µs', tolerance: '±5%' },
    ]
  },
  {
    id: 'dht11',
    name: 'DHT11 Temp & Humidity',
    paramKeys: ['TEMP', 'HUMIDITY', 'TEMP_C'],
    voltage: '3.3V - 5.5V DC',
    interface: '1-Wire Digital Signal',
    defaultOutputs: [
      { param: 'Temperature Range', nominal: '0°C - 50°C', tolerance: '±2°C' },
      { param: 'Humidity Range', nominal: '20% - 90% RH', tolerance: '±5%' },
      { param: 'Read Interval', nominal: '2.0 sec', tolerance: 'Minimum interval' },
    ]
  },
  {
    id: 'hc-sr04',
    name: 'HC-SR04 Ultrasonic Distance',
    paramKeys: ['DISTANCE', 'DISTANCE_CM'],
    voltage: '5V DC (Strict)',
    interface: 'Digital Pulse (Trig/Echo)',
    defaultOutputs: [
      { param: 'Blind Zone', nominal: '< 2 cm', tolerance: 'Minimum distance' },
      { param: 'Max Range', nominal: '400 cm', tolerance: '±3 mm' },
      { param: 'Echo Pulse', nominal: '100µs - 25000µs', tolerance: 'PulseIn timing' }
    ]
  }
];

export default function SensorQualityChecker() {
  const [selectedProfile, setSelectedProfile] = useState(SENSOR_QC_PROFILES[0]);
  const [mode, setMode] = useState('LIVE');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);

  const { isConnected, hardwareInfo, telemetryData, connectHardwarePort } = useHardware();

  const runGeminiQCComparison = async (currentTelemetry) => {
    setAnalyzing(true);
    try {
      const result = await analyzeQCSignalsWithGemini({
        sensorName: selectedProfile.name,
        defaultNominals: selectedProfile.defaultOutputs,
        measuredTelemetry: currentTelemetry || {}
      });
      setAiAnalysisResult(result);
    } catch (err) {
      console.error("Gemini QC Signal Analysis Error:", err);
    }
    setAnalyzing(false);
  };

  useEffect(() => {
    runGeminiQCComparison(telemetryData);
  }, [selectedProfile, telemetryData, mode, isConnected]);

  return (
    <div className="p-8 bg-slate-950 text-white min-h-screen space-y-8">
      {/* Header */}
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-3">
            <Sparkles size={14} className="text-blue-400" /> Google Gemini AI Hardware Signal Inspector
          </div>
          <h1 className="text-3xl font-bold text-white">Microcontroller Signal QC & AI Comparator</h1>
          <p className="text-gray-400 text-sm mt-1">
            Compares live measured USB hardware signals against factory fixed nominal specifications using Google Gemini AI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-blue-400 focus:outline-none"
          >
            <option value="LIVE">🔌 Mode: Physical Hardware Signals</option>
            <option value="SIMULATE_PASS">🟢 Demo Mode: Simulate Pass</option>
            <option value="SIMULATE_FAULT">⚠️ Demo Mode: Simulate Fault</option>
          </select>

          <button
            onClick={() => runGeminiQCComparison(telemetryData)}
            disabled={analyzing}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-blue-600/20"
          >
            {analyzing ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {analyzing ? 'Gemini AI Analyzing...' : 'Run Gemini AI Signal Analysis'}
          </button>
        </div>
      </div>

      {/* Live Hardware Status Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-ping' : 'bg-slate-600'}`} />
          <span className="font-bold text-white">
            {isConnected ? `🟢 Connected to ${hardwareInfo?.boardName || 'Microcontroller'} (VID: ${hardwareInfo?.hexVid})` : '🔌 DISCONNECTED — Waiting for Physical Microcontroller USB Port'}
          </span>
        </div>

        {!isConnected && (
          <button
            onClick={() => connectHardwarePort("115200")}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition"
          >
            <Usb size={14} /> Connect Microcontroller USB
          </button>
        )}
      </div>

      {/* Sensor Profile Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SENSOR_QC_PROFILES.map((prof) => (
          <button
            key={prof.id}
            onClick={() => setSelectedProfile(prof)}
            className={`p-4 rounded-2xl border text-left transition ${
              selectedProfile.id === prof.id
                ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                : 'bg-slate-900 border-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            <div className="text-xs font-bold">{prof.name}</div>
            <div className="text-[10px] text-gray-500 mt-1">{prof.interface}</div>
          </button>
        ))}
      </div>

      {/* Main Inspection Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Factory Fixed Specifications Matrix */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-blue-500 flex items-center gap-2">
            <Cpu size={18} /> Factory Fixed Nominal Limits
          </h2>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between text-xs">
              <span className="text-gray-400 font-semibold">Operating Voltage</span>
              <span className="font-bold text-blue-400">{selectedProfile.voltage}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between text-xs">
              <span className="text-gray-400 font-semibold">Signal Interface</span>
              <span className="font-bold text-blue-400">{selectedProfile.interface}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {selectedProfile.defaultOutputs.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white">{item.param}</div>
                  <div className="text-[10px] text-gray-500">Tol: {item.tolerance}</div>
                </div>
                <div className="font-extrabold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                  {item.nominal}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gemini AI Signal Comparator & Verdict Results */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="text-blue-400" size={18} /> Google Gemini AI Signal Comparator Verdict
            </h2>
            <span className="text-[10px] font-bold text-gray-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              Engine: {aiAnalysisResult?.source || "Google Gemini AI"}
            </span>
          </div>

          {!isConnected && mode === 'LIVE' ? (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <Usb size={24} className="text-blue-400" />
                <div>
                  <span className="text-sm font-bold text-white">🔌 Waiting for Microcontroller Signal Stream</span>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Connect your Arduino UNO Q, STM32, or ESP32 board to compare live measured signals against factory nominal limits using Gemini AI.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => connectHardwarePort("115200")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
                >
                  <Usb size={14} /> Connect Microcontroller USB
                </button>
                <button
                  onClick={() => setMode('SIMULATE_PASS')}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 text-blue-400 font-bold text-xs transition"
                >
                  🟢 Run Simulated Gemini Analysis
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Verdict Header Badge */}
              <div className={`p-6 rounded-2xl border ${
                aiAnalysisResult?.verdict === 'OPTIMAL_PASS' || mode === 'SIMULATE_PASS'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-red-950/40 border-red-500/40 text-red-300'
              }`}>
                <div className="flex items-center gap-3">
                  {aiAnalysisResult?.verdict === 'OPTIMAL_PASS' || mode === 'SIMULATE_PASS' ? (
                    <CheckCircle2 size={32} className="text-emerald-400" />
                  ) : (
                    <AlertTriangle size={32} className="text-red-400" />
                  )}
                  <div>
                    <div className="text-base font-extrabold text-white">
                      VERDICT: {aiAnalysisResult?.verdict === 'OPTIMAL_PASS' || mode === 'SIMULATE_PASS' ? 'OPTIMAL (PASSED)' : 'HARDWARE FAULT / DRIFT DETECTED'}
                    </div>
                    <div className="text-xs text-gray-300 mt-0.5">{aiAnalysisResult?.summary}</div>
                  </div>
                </div>
              </div>

              {/* Gemini AI Signal Comparison Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-400">
                  Fixed Nominal Specs vs Live Measured Signals
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-gray-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3">Parameter</th>
                        <th className="p-3">Factory Nominal Spec</th>
                        <th className="p-3">Measured Hardware Signal</th>
                        <th className="p-3">Deviation</th>
                        <th className="p-3">Gemini Verdict</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/50">
                      {aiAnalysisResult?.comparisons?.map((c, i) => (
                        <tr key={i} className="hover:bg-slate-900/50">
                          <td className="p-3 font-bold text-white">{c.param}</td>
                          <td className="p-3 text-blue-400">{c.factoryNominal}</td>
                          <td className="p-3 text-emerald-400 font-extrabold">{c.measuredValue}</td>
                          <td className="p-3 text-gray-300">{c.deviation}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                              c.status === 'PASS' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                : 'bg-red-500/10 text-red-400 border-red-500/30'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Gemini AI Root Cause Analysis */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-blue-400 flex items-center gap-2">
                  <Sparkles size={14} /> Gemini AI Root-Cause Diagnostic Analysis:
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed font-mono">
                  {aiAnalysisResult?.rootCause}
                </p>
              </div>

              {/* Gemini AI Repair Recommendations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Wrench size={14} /> Gemini AI Actionable Hardware Recommendations:
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {aiAnalysisResult?.recommendations?.map((rec, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-gray-300">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
