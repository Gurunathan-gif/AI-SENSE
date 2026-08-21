import React, { useState } from "react";
import { Settings, Cpu, Brain, User, Save, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [boardName] = useState("Arduino UNO Q");
  const [baudRate, setBaudRate] = useState("115200");
  const [aiMode, setAiMode] = useState("Edge / Hybrid");
  const [userName, setUserName] = useState("Gurunathan");
  const [userRole, setUserRole] = useState("Developer");
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ── HEADER ── */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Settings className="text-blue-400" /> Platform Settings
          </h1>
          <p className="text-xs text-gray-400 mt-1">Configure hardware serial communication, Edge AI engine modes &amp; user profile</p>
        </div>

        {savedNotice && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            <CheckCircle2 size={16} /> Settings Saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. Hardware Settings */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu size={16} className="text-blue-400" /> Hardware Configuration
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-gray-400 font-bold">Connected Board</label>
              <input
                type="text"
                disabled
                value={boardName}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 font-bold">WebSerial Baud Rate</label>
              <select
                value={baudRate}
                onChange={(e) => setBaudRate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none font-mono"
              >
                <option value="9600">9600 Baud</option>
                <option value="57600">57600 Baud</option>
                <option value="115200">115200 Baud (Arduino UNO Q Default)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. AI Engine Settings */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Brain size={16} className="text-purple-400" /> AI Diagnostic Engine Configuration
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-gray-400 font-bold">Analysis Engine Mode</label>
              <select
                value={aiMode}
                onChange={(e) => setAiMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none font-mono"
              >
                <option value="Edge / Hybrid">Edge / Hybrid AI (Recommended for UNO Q)</option>
                <option value="Cloud AI Only">Cloud AI Processing Only</option>
                <option value="Local Rules Engine">Local Heuristic Rules Engine</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. User Profile */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <User size={16} className="text-emerald-400" /> User Profile
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-gray-400 font-bold">Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 font-bold">Role</label>
              <input
                type="text"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
        >
          <Save size={16} /> Save Platform Settings
        </button>

      </form>
    </div>
  );
}