import React from "react";
import { Link } from "react-router-dom";
import { 
  Activity, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Brain, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Sparkles, 
  Terminal, 
  Code, 
  Wrench, 
  Recycle, 
  GraduationCap, 
  Factory, 
  Microscope, 
  UserCheck 
} from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 sm:px-12 rounded-3xl border border-slate-800">
        <div className="max-w-5xl mx-auto space-y-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles size={14} className="animate-pulse" /> Edge AI + Arduino UNO Q Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            AI that understands <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
              your physical hardware.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto leading-relaxed">
            AI SENSE is an intelligent hardware development and diagnostic platform that connects physical sensors to Arduino UNO Q, analyzes real-time sensor behavior using AI, detects abnormalities, and provides intelligent troubleshooting recommendations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/testing"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition hover:scale-105"
            >
              <Activity size={18} /> Start Testing <ArrowRight size={16} />
            </Link>
            <Link
              to="/dashboard"
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl flex items-center gap-2 transition"
            >
              <Cpu size={18} /> Explore AI SENSE
            </Link>
            <Link
              to="/modules"
              className="bg-slate-950 hover:bg-slate-900 border border-blue-500/40 text-blue-400 font-bold text-sm px-6 py-3.5 rounded-xl flex items-center gap-2 transition"
            >
              <Layers size={18} /> View Hardware
            </Link>
          </div>

          {/* Hero Visual Flow Diagram */}
          <div className="pt-8">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md max-w-4xl mx-auto text-left space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 border-b border-slate-800 pb-3">
                <span className="flex items-center gap-2 text-blue-400">
                  <Cpu size={16} /> AI SENSE Real-Time Physical Hardware Architecture Flow
                </span>
                <span className="text-emerald-400 font-mono">CLOSED-LOOP SYSTEM</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs font-bold">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-gray-400 text-[10px]">1. HARDWARE CORE</div>
                  <div className="text-blue-400 font-mono">Arduino UNO Q</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-gray-400 text-[10px]">2. SENSOR I/O</div>
                  <div className="text-indigo-400 font-mono">DHT22 / MQ-6 / MPU</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-gray-400 text-[10px]">3. STREAM</div>
                  <div className="text-purple-400 font-mono">Raw Telemetry</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-gray-400 text-[10px]">4. EDGE AI</div>
                  <div className="text-amber-400 font-mono">Anomaly Detector</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1 col-span-2 sm:col-span-1">
                  <div className="text-gray-400 text-[10px]">5. DIAGNOSIS</div>
                  <div className="text-emerald-400 font-mono">🟢 HEALTHY / 🔴 FAULT</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 2. PROBLEM STATEMENT ── */}
      <section className="px-6 max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-red-400 uppercase tracking-widest">The Embedded Engineering Problem</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Why Embedded Debugging Is Broken</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-red-500/20 space-y-4">
            <h3 className="text-base font-bold text-red-400 flex items-center gap-2">
              <AlertTriangle size={18} /> Traditional IDEs &amp; Serial Monitors
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Developing and debugging embedded systems often requires engineers to manually determine whether an unexpected output is caused by:
            </p>
            <ul className="text-xs text-gray-400 space-y-2 list-disc list-inside">
              <li>Incorrect software code logic</li>
              <li>Sensor hardware degradation or internal failure</li>
              <li>Loose or incorrect jumper pin wiring</li>
              <li>Unstable power supply or voltage drops</li>
              <li>I2C / SPI / UART communication timeouts</li>
              <li>Environmental noise or electromagnetic interference</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-blue-500/20 space-y-4">
            <h3 className="text-base font-bold text-blue-400 flex items-center gap-2">
              <Brain size={18} /> The AI SENSE Breakthrough
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              AI SENSE addresses this gap by connecting AI directly with physical embedded hardware. Instead of simply displaying raw sensor readings, AI SENSE analyzes sensor behavior over time and provides an intelligent assessment of sensor health, abnormality detection, and troubleshooting guidance.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-blue-500/30 text-[11px] text-blue-300 font-bold">
              ⚡ AI SENSE doesn't stop at generating code. It connects AI with real physical hardware.
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. 4-STAGE SOLUTION ── */}
      <section className="px-6 max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">Our Solution Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">The 4-Stage Hardware Feedback Loop</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-blue-500/40 transition">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 font-extrabold text-sm flex items-center justify-center">1</div>
            <h4 className="text-sm font-bold text-white">Connect</h4>
            <p className="text-xs text-gray-400">Connect physical sensors to Arduino UNO Q I/O pins.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-indigo-500/40 transition">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 font-extrabold text-sm flex items-center justify-center">2</div>
            <h4 className="text-sm font-bold text-white">Collect</h4>
            <p className="text-xs text-gray-400">Capture real-time sensor measurements &amp; telemetry streams.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-purple-500/40 transition">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 font-extrabold text-sm flex items-center justify-center">3</div>
            <h4 className="text-sm font-bold text-white">Analyze</h4>
            <p className="text-xs text-gray-400">Process sensor data using Edge AI, calculating stability &amp; variance.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-emerald-500/40 transition">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 font-extrabold text-sm flex items-center justify-center">4</div>
            <h4 className="text-sm font-bold text-white">Diagnose</h4>
            <p className="text-xs text-gray-400">Identify abnormal behavior and provide 4-step troubleshooting recommendations.</p>
          </div>
        </div>
      </section>

      {/* ── 4. KEY FEATURES ── */}
      <section className="px-6 max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Platform Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Comprehensive Key Features</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <Brain size={22} className="text-blue-400" />
            <h4 className="text-sm font-bold text-white">🧠 Edge AI Analysis</h4>
            <p className="text-xs text-gray-400">Analyze sensor data close to physical hardware.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <Activity size={22} className="text-indigo-400" />
            <h4 className="text-sm font-bold text-white">🔬 Sensor Testing</h4>
            <p className="text-xs text-gray-400">Run automated tests on connected physical sensors.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <ShieldCheck size={22} className="text-emerald-400" />
            <h4 className="text-sm font-bold text-white">🩺 Hardware Diagnostics</h4>
            <p className="text-xs text-gray-400">Identify abnormal sensor behavior and hardware faults.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <BarChart3 size={22} className="text-purple-400" />
            <h4 className="text-sm font-bold text-white">📊 Real-Time Monitoring</h4>
            <p className="text-xs text-gray-400">View live sensor readings and performance metrics.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <Sparkles size={22} className="text-amber-400" />
            <h4 className="text-sm font-bold text-white">🤖 AI Engineering Assistant</h4>
            <p className="text-xs text-gray-400">Ask AI about hardware, circuits, and troubleshooting.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <Code size={22} className="text-cyan-400" />
            <h4 className="text-sm font-bold text-white">💻 Code Generation</h4>
            <p className="text-xs text-gray-400">Generate Arduino &amp; UNO Q C++ code from natural language.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <BarChart3 size={22} className="text-pink-400" />
            <h4 className="text-sm font-bold text-white">📈 Data Analysis</h4>
            <p className="text-xs text-gray-400">Analyze sensor trends, variations, and abnormal spikes.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <Wrench size={22} className="text-teal-400" />
            <h4 className="text-sm font-bold text-white">🛠 Troubleshooting</h4>
            <p className="text-xs text-gray-400">Receive AI-generated wiring and calibration suggestions.</p>
          </div>
        </div>
      </section>

      {/* ── 5. DUAL-BRAIN UNO Q HARDWARE SPECIFICATION ── */}
      <section className="px-6 max-w-6xl mx-auto">
        <div className="p-8 rounded-3xl bg-slate-900 border border-blue-500/30 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">Hardware Backbone</span>
              <h2 className="text-2xl font-extrabold text-white">Arduino UNO Q — The Dual-Brain of AI SENSE</h2>
            </div>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full border border-blue-500/30">
              Hybrid SBC + MCU Architecture
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <Cpu size={16} /> STM32U585 Microcontroller (MCU Side)
              </h4>
              <p className="text-xs text-gray-300">
                Responsible for ultra-low latency sensor data acquisition, I2C/SPI communication, and real-time GPIO hardware control.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                <Brain size={16} /> Qualcomm QRB2210 (Linux/AI Side)
              </h4>
              <p className="text-xs text-gray-300">
                Runs Debian Linux, Python processing, Edge AI algorithms, and higher-level telemetry analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. TARGET USERS & HACKATHON PITCH ── */}
      <section className="px-6 max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-extrabold text-white">Who Uses AI SENSE?</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <GraduationCap className="text-blue-400" size={18} />
              <strong className="text-white block">🎓 Students</strong>
              <span className="text-gray-400">Learn electronics via intelligent feedback.</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <UserCheck className="text-indigo-400" size={18} />
              <strong className="text-white block">👨‍💻 Embedded Developers</strong>
              <span className="text-gray-400">Debug hardware and sensor issues faster.</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <Factory className="text-emerald-400" size={18} />
              <strong className="text-white block">🏭 Industrial Engineers</strong>
              <span className="text-gray-400">Monitor sensor behavior &amp; fault trends.</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <Microscope className="text-purple-400" size={18} />
              <strong className="text-white block">🔬 Researchers</strong>
              <span className="text-gray-400">Collect &amp; analyze experimental sensor data.</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <Sparkles size={16} /> 30-Second Elevator Pitch
              </span>
              <span className="text-gray-400 font-mono">HACKATHON DEMO</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed italic">
              "AI SENSE is an AI-powered hardware development and diagnostic platform. We use Arduino UNO Q to connect physical sensors with both real-time control and high-level AI processing. Our system collects raw sensor data, analyzes its behavior, detects abnormal conditions, and provides intelligent troubleshooting recommendations through a web dashboard. Unlike conventional AI coding assistants that only generate code, AI SENSE closes the loop between AI and real physical hardware."
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-bold text-white">
            <span className="flex items-center gap-2 text-emerald-400">
              <Recycle size={16} /> E-Waste &amp; Sustainability Contribution
            </span>
            <Link to="/testing" className="text-blue-400 hover:underline flex items-center gap-1">
              Test Sensors <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}