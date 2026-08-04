import React from 'react';
import { Cpu, Terminal, ShieldCheck, Zap, Layers, Server, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ARDUINO_UNO_Q_SPECS = {
  boardName: "Arduino UNO Q",
  type: "Hybrid AI Single Board Computer (SBC)",
  applicationProcessor: {
    name: "Qualcomm Dragonwing QRB2210",
    architecture: "Quad-core 64-bit ARM Cortex-A53",
    role: "AI Processing, Linux Applications, Analytics & Embedded OS"
  },
  microcontroller: {
    name: "STM32U585",
    architecture: "ARM Cortex-M33 Ultra-Low-Power MCU",
    role: "Sensor Interfacing, Real-Time Hardware Control & I/O"
  },
  operatingSystem: {
    name: "Debian Linux",
    role: "Runs AI SENSE Services, Drivers & High-Level Edge Applications"
  },
  aiEngine: {
    name: "Google Gemini API Integration",
    role: "Code Generation, Deep Hardware Synthesis & Intelligent Diagnostics"
  },
  communicationBuses: [
    "High-Speed UART (Serial Terminal)",
    "I²C Bus (SDA / SCL Multi-drop)",
    "SPI Bus (MOSI / MISO / SCK / CS)",
    "USB Type-C (Host & Device Debugger)",
    "Wi-Fi 5 / Bluetooth 5.1 (Wireless Mesh & IoT)"
  ]
};

export default function HardwareSpecs() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-500">
            <Cpu size={36} />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
              Hybrid AI Single Board Computer
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Arduino UNO Q Hardware Architecture</h2>
            <p className="text-xs text-gray-400 mt-1">
              Powered by Dual-Processor Core Architecture: Qualcomm Dragonwing QRB2210 + STM32U585 ARM Cortex-M33
            </p>
          </div>
        </div>

        <Link
          to="/chat"
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-blue-500/20"
        >
          <Zap size={16} /> Program UNO Q in AI Studio <ArrowRight size={14} />
        </Link>
      </div>

      {/* Dual Core Architecture Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Application Processor */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-blue-500/30 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-extrabold rounded-bl-xl border-l border-b border-blue-500/30">
            APPLICATION PROCESSOR
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase">High-Performance Compute Core</div>
          <h3 className="text-xl font-black text-white">{ARDUINO_UNO_Q_SPECS.applicationProcessor.name}</h3>
          <p className="text-xs text-blue-400 font-mono font-semibold">{ARDUINO_UNO_Q_SPECS.applicationProcessor.architecture}</p>
          <p className="text-xs text-gray-300 leading-relaxed pt-2 border-t border-slate-900">
            {ARDUINO_UNO_Q_SPECS.applicationProcessor.role}
          </p>
        </div>

        {/* Microcontroller Coprocessor */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-green-500/30 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-extrabold rounded-bl-xl border-l border-b border-green-500/30">
            REAL-TIME MICROCONTROLLER
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase">Real-Time Sensor Core</div>
          <h3 className="text-xl font-black text-white">{ARDUINO_UNO_Q_SPECS.microcontroller.name}</h3>
          <p className="text-xs text-green-400 font-mono font-semibold">{ARDUINO_UNO_Q_SPECS.microcontroller.architecture}</p>
          <p className="text-xs text-gray-300 leading-relaxed pt-2 border-t border-slate-900">
            {ARDUINO_UNO_Q_SPECS.microcontroller.role}
          </p>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-slate-950 text-gray-400 font-extrabold uppercase border-b border-slate-800">
            <tr>
              <th className="p-4">Component</th>
              <th className="p-4">Specification</th>
              <th className="p-4">Role in AI SENSE Platform</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900 text-gray-300">
            <tr>
              <td className="p-4 font-bold text-white flex items-center gap-2">
                <Cpu size={16} className="text-blue-500" /> Board Platform
              </td>
              <td className="p-4 font-extrabold text-blue-400">Arduino UNO Q</td>
              <td className="p-4">Hybrid AI single board computer platform</td>
            </tr>
            <tr>
              <td className="p-4 font-bold text-white flex items-center gap-2">
                <Server size={16} className="text-purple-500" /> Application Processor
              </td>
              <td className="p-4 font-extrabold text-purple-400">Qualcomm Dragonwing QRB2210 (Quad-core)</td>
              <td className="p-4">AI processing, Linux applications, analytics & edge compute</td>
            </tr>
            <tr>
              <td className="p-4 font-bold text-white flex items-center gap-2">
                <Activity size={16} className="text-green-500" /> Microcontroller
              </td>
              <td className="p-4 font-extrabold text-green-400">STM32U585 (ARM Cortex-M33)</td>
              <td className="p-4">Sensor interfacing and real-time hardware I/O control</td>
            </tr>
            <tr>
              <td className="p-4 font-bold text-white flex items-center gap-2">
                <Terminal size={16} className="text-amber-500" /> Operating System
              </td>
              <td className="p-4 font-extrabold text-amber-400">Debian Linux OS</td>
              <td className="p-4">Runs AI SENSE services, drivers, and background tasks</td>
            </tr>
            <tr>
              <td className="p-4 font-bold text-white flex items-center gap-2">
                <Zap size={16} className="text-cyan-500" /> AI Engine
              </td>
              <td className="p-4 font-extrabold text-cyan-400">Google Gemini API Engine</td>
              <td className="p-4">Code generation, sensor synthesizer, and intelligent diagnostics</td>
            </tr>
            <tr>
              <td className="p-4 font-bold text-white flex items-center gap-2">
                <Layers size={16} className="text-rose-500" /> Communication Buses
              </td>
              <td className="p-4 font-extrabold text-rose-400">UART, SPI, I²C, USB, Wi-Fi 5 / Bluetooth 5.1</td>
              <td className="p-4">Hardware peripherals and external IoT connectivity</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
