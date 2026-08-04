import React from 'react';
import HardwareSpecs from '../components/HardwareSpecs';
import { BookOpen, Cpu, ShieldCheck, Terminal, Zap } from 'lucide-react';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex justify-between items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-3">
            <BookOpen size={14} /> Official Hardware Datasheet & System Manual
          </div>
          <h1 className="text-4xl font-bold text-white">AI SENSE Documentation</h1>
          <p className="text-gray-400 text-sm mt-2">
            Technical architecture guide for Arduino UNO Q Single Board Computer & Google Gemini AI Engine.
          </p>
        </div>
      </div>

      {/* Arduino UNO Q Specs Component */}
      <HardwareSpecs />

      {/* Manual Guides Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 space-y-4">
          <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
            <Cpu className="text-blue-500" /> Arduino UNO Q Architecture
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            The <strong>Arduino UNO Q</strong> is a hybrid AI single board computer featuring a dual-processor architecture:
          </p>
          <ul className="space-y-3 text-xs text-gray-300">
            <li className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <strong className="text-white">Qualcomm Dragonwing QRB2210 Quad-Core</strong>: Runs 64-bit Debian Linux OS, high-level computer vision, AI analytics, and web communications.
            </li>
            <li className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <strong className="text-white">STM32U585 ARM Cortex-M33 Coprocessor</strong>: Manages real-time 115200 baud serial telemetry, PWM, I2C, SPI, and direct sensor interfacing.
            </li>
          </ul>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 space-y-4">
          <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
            <Zap className="text-blue-500" /> AI SENSE Software Workflows
          </h2>
          <ul className="space-y-3 text-xs text-gray-300">
            <li className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span><strong>AI Code Studio (`/chat`)</strong> — Natural language C++ synthesis</span>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">Active</span>
            </li>
            <li className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span><strong>Sensor Lab (`/sensors`)</strong> — 100 Hardware Sensors Database</span>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">Active</span>
            </li>
            <li className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span><strong>QC Diagnostics (`/qc`)</strong> — Automated Nominal Evaluation</span>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">Active</span>
            </li>
            <li className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span><strong>RUN Studio (`/run`)</strong> — Real-Time WebSerial Hardware Monitor</span>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">Active</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}