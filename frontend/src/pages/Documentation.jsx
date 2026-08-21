import React, { useState } from "react";
import { 
  BookOpen, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Code, 
  Wrench, 
  CheckCircle2, 
  ArrowRight, 
  Terminal, 
  Layers 
} from "lucide-react";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections = [
    { id: "getting-started", title: "1. Getting Started", icon: BookOpen },
    { id: "unoq-setup", title: "2. Arduino UNO Q Setup", icon: Cpu },
    { id: "sensor-connections", title: "3. Sensor Connections", icon: Layers },
    { id: "sensor-testing", title: "4. Sensor Testing Studio", icon: Activity },
    { id: "ai-diagnostics", title: "5. AI Diagnostics Engine", icon: ShieldCheck },
    { id: "code-generation", title: "6. C++ Code Generation", icon: Code },
    { id: "data-analysis", title: "7. Data Analysis", icon: Activity },
    { id: "troubleshooting", title: "8. Hardware Troubleshooting", icon: Wrench },
  ];

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <BookOpen className="text-blue-400" /> Platform Documentation &amp; User Manual
        </h1>
        <p className="text-xs text-gray-400 mt-1">Complete step-by-step guides for Arduino UNO Q setup, physical sensor connections, WebSerial flashing &amp; AI diagnostics</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          {sections.map((s) => {
            const Icon = s.icon;
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "bg-slate-900 text-gray-300 hover:bg-slate-800"
                }`}
              >
                <Icon size={16} /> {s.title}
              </button>
            );
          })}
        </div>

        {/* Content Display Panel */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6 text-xs text-gray-300">
          
          {activeSection === "getting-started" && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-white">1. Getting Started with AI SENSE</h2>
              <p className="leading-relaxed">
                AI SENSE is an intelligent hardware development and diagnostic platform designed to bridge the gap between artificial intelligence and physical electronics. The platform combines Arduino UNO Q, real-time sensor acquisition, edge computing, AI-assisted analysis, and a web-based development environment to help users build, test, and diagnose embedded systems.
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 text-blue-300 font-bold space-y-1">
                ⚡ Core Concept: Connect hardware $\rightarrow$ Collect raw readings $\rightarrow$ Analyze via Edge AI $\rightarrow$ Diagnose (🟢 GOOD / 🟡 WARNING / 🔴 FAULT).
              </div>
            </div>
          )}

          {activeSection === "unoq-setup" && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-white">2. Arduino UNO Q Dual-Brain Setup</h2>
              <p className="leading-relaxed">
                AI SENSE utilizes the Arduino UNO Q as its central hardware core. Its dual-brain architecture combines real-time microcontroller control with high-level Linux processing:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong>STM32U585 MCU Side</strong>: Sensor data acquisition, I2C/SPI bus reads, and GPIO pin control.</li>
                <li><strong>Qualcomm QRB2210 Linux Side</strong>: Runs Python processing, RPC bridge communication, and Edge AI analysis.</li>
              </ul>
            </div>
          )}

          {activeSection === "sensor-connections" && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-white">3. Sensor Connection Protocols</h2>
              <p className="leading-relaxed">
                Connect physical sensors to the Arduino UNO Q I/O headers:
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
                <div>• DHT22: VCC (+5V), GND (GND), DATA (Digital Pin 2 with 10k resistor)</div>
                <div>• MQ-6: VCC (+5V), GND (GND), AOUT (Analog Pin A0)</div>
                <div>• LDR: VCC (+5V), GND (GND via 10k resistor), AOUT (Analog Pin A1)</div>
                <div>• MPU6050: VCC (+3.3V/5V), GND, SDA (A4), SCL (A5)</div>
              </div>
            </div>
          )}

          {activeSection === "sensor-testing" && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-white">4. Sensor Testing Studio Guide</h2>
              <p className="leading-relaxed">
                Navigate to <strong>Sensor Testing</strong> to select your connected sensor, click <strong>Start Sensor Test</strong>, and view real-time SVG signal plots alongside live telemetry metrics.
              </p>
            </div>
          )}

          {activeSection === "ai-diagnostics" && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-white">5. AI Diagnostics Engine</h2>
              <p className="leading-relaxed">
                AI SENSE evaluates data stability, transient response speed, and outlier frequency to generate a diagnostic health status: <strong>🟢 GOOD</strong>, <strong>🟡 WARNING</strong>, or <strong>🔴 FAULT</strong>.
              </p>
            </div>
          )}

          {activeSection === "code-generation" && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-white">6. C++ Code Generation &amp; Flashing</h2>
              <p className="leading-relaxed">
                Use the <strong>AI Assistant</strong> to generate natural language Arduino C++ code, then click <strong>Run / Test</strong> to transfer code directly to <strong>RUN Studio</strong> and flash via WebSerial USB.
              </p>
            </div>
          )}

          {activeSection === "data-analysis" && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-white">7. Sensor Data Analytics</h2>
              <p className="leading-relaxed">
                View statistical summaries (sample count, minimum, maximum, mean, standard deviation) and compare health metrics across multiple connected sensors.
              </p>
            </div>
          )}

          {activeSection === "troubleshooting" && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-white">8. Hardware Troubleshooting Protocol</h2>
              <p className="leading-relaxed">
                If a 🔴 SENSOR FAULT DETECTED alert occurs:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-emerald-400 font-mono">
                <li>Verify VCC (+5V) and GND pin connections.</li>
                <li>Check jumper wire continuity and pin alignment.</li>
                <li>Verify supply voltage stability and power rails.</li>
                <li>Allow required sensor warm-up time and re-run test.</li>
              </ol>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}