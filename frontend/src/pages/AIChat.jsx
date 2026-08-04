import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Send, Bot, User, Copy, Save, Trash2, Sparkles, Zap, Cpu, Layers } from "lucide-react";
import { generateCode } from "../services/aiService";
import { saveProject } from "../services/projectService";
import { ALL_100_SENSORS } from "../components/SensorLibrary";

export default function AIChat() {
  const location = useLocation();
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [boardTarget, setBoardTarget] = useState("Arduino UNO Q (32-Bit ARM)");
  const [selectedLibrarySensor, setSelectedLibrarySensor] = useState("");

  const bottomRef = useRef(null);

  // Check URL query param for ?prompt=... from 100 Sensor Library
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialPrompt = params.get("prompt");
    if (initialPrompt) {
      setPrompt(initialPrompt);
      handleSend(initialPrompt);
    }
  }, [location.search]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (customPrompt) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim()) return;

    const userMessage = { type: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await generateCode(textToSend, boardTarget);
      const aiMessage = {
        type: "ai",
        code: res.code || (typeof res === "string" ? res : JSON.stringify(res, null, 2)),
        wiring: res.wiring || [],
        components: res.componentsNeeded || [],
        title: res.title || "Arduino Generated Program",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setPrompt("");
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          code: "// Error generating code.\n// Fallback engine active.",
          wiring: [],
          components: [],
        },
      ]);
    }
    setLoading(false);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  const saveCurrentProject = async (msg) => {
    try {
      await saveProject({
        title: msg.title || "Arduino Project",
        prompt,
        code: msg.code,
      });
      alert("Project saved successfully!");
    } catch {
      alert("Failed to save project.");
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleSelectFrom100Sensors = (sensorId) => {
    const found = ALL_100_SENSORS.find((s) => s.id === sensorId);
    if (found) {
      setSelectedLibrarySensor(sensorId);
      const generatedPrompt = `Generate complete Arduino C++ program for ${found.name} measuring ${found.measures}. Output real-time telemetry.`;
      setPrompt(generatedPrompt);
      handleSend(generatedPrompt);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between hidden lg:flex">
        <div>
          <h1 className="text-3xl font-bold text-blue-500 flex items-center gap-2">
            <Cpu className="text-blue-500" /> AI SENSE
          </h1>
          <p className="text-xs text-gray-400 mt-1">Arduino AI Code Studio</p>

          <button
            onClick={clearChat}
            className="mt-6 w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
          >
            <Trash2 size={16} /> Clear Session
          </button>

          {/* Board Selector */}
          <div className="mt-6">
            <h2 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-2">
              Target Hardware Board
            </h2>
            <select
              value={boardTarget}
              onChange={(e) => setBoardTarget(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-blue-400 font-bold focus:outline-none"
            >
              <option value="Arduino UNO Q (32-Bit ARM)">Arduino UNO Q</option>
              <option value="Arduino UNO R3">Arduino UNO R3</option>
              <option value="Arduino Mega 2560">Arduino Mega 2560</option>
              <option value="Arduino Nano">Arduino Nano R3</option>
            </select>
          </div>

          {/* 100 Sensor Direct Selector */}
          <div className="mt-6">
            <h2 className="text-xs font-extrabold uppercase text-blue-400 tracking-wider mb-2 flex items-center gap-1.5">
              <Layers size={14} /> Pick from 100 Sensors Library
            </h2>
            <select
              value={selectedLibrarySensor}
              onChange={(e) => handleSelectFrom100Sensors(e.target.value)}
              className="w-full bg-slate-950 border border-blue-500/30 rounded-xl p-3 text-xs text-white font-semibold focus:outline-none"
            >
              <option value="">-- Choose Any of 100 Sensors --</option>
              {ALL_100_SENSORS.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.id} {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Sensor Starters */}
          <div className="mt-6 space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
            <h2 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-2">
              Popular Quick Starters
            </h2>
            {ALL_100_SENSORS.slice(0, 10).map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectFrom100Sensors(s.id)}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 transition text-xs font-bold text-blue-400 truncate flex justify-between items-center"
              >
                <span>#{s.id} {s.name}</span>
                <span className="text-[10px] text-gray-500 font-normal">{s.category}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300 mt-4">
          <Zap className="w-4 h-4 text-blue-400 mb-1" />
          Supports all <strong>100 Sensors</strong> with automatic pinouts & C++ code!
        </div>
      </div>

      {/* Main Chat Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-800 p-6 bg-slate-900/60 backdrop-blur flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="text-blue-500" /> AI Code Studio
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Generate Arduino C++ programs & circuit pinout schematics for all 100 sensors</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            {boardTarget}
          </span>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mx-auto">
                <Bot size={36} />
              </div>
              <h3 className="text-xl font-bold text-white">What sensor or hardware program do you want to build?</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Choose any sensor from the 100 Sensor Library or type any custom prompt below!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto pt-4">
                {ALL_100_SENSORS.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectFrom100Sensors(s.id)}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 text-left text-xs font-bold text-blue-400 hover:text-white transition"
                  >
                    <div className="mb-1 text-white">#{s.id} {s.name}</div>
                    <div className="text-[10px] text-gray-400 font-normal">Measures: {s.measures}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
              {msg.type === "ai" && <Bot className="text-blue-400 mr-3 mt-2 shrink-0" size={32} />}

              <div className={`max-w-4xl rounded-2xl p-6 ${msg.type === "user" ? "bg-blue-600 text-white" : "bg-slate-900 border border-slate-800 space-y-4"}`}>
                {msg.type === "user" ? (
                  <p className="text-sm font-semibold">{msg.text}</p>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase text-blue-400 tracking-wider">
                        {msg.title || "Arduino C++ Code"}
                      </span>
                    </div>

                    <pre className="whitespace-pre-wrap overflow-x-auto text-green-400 font-mono text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-96">
                      {msg.code}
                    </pre>

                    {msg.wiring && msg.wiring.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <span className="text-xs font-bold text-gray-300">Circuit Wiring:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.wiring.map((w, wi) => (
                            <div key={wi} className="text-xs font-mono bg-slate-950 p-2 rounded-lg border border-slate-800 text-blue-300">
                              {w}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => copyCode(msg.code)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition"
                      >
                        <Copy size={16} /> Copy Code
                      </button>
                      <button
                        onClick={() => saveCurrentProject(msg)}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition"
                      >
                        <Save size={16} /> Save to Cloud
                      </button>
                    </div>
                  </>
                )}
              </div>

              {msg.type === "user" && <User className="ml-3 mt-2 text-white shrink-0" size={32} />}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <Bot className="text-blue-400 animate-pulse" size={32} />
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-blue-400 font-bold animate-pulse">
                Generating Arduino C++ code and circuit pinout...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-800 p-6 bg-slate-900/80">
          <div className="flex gap-3">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Type any of the 100 sensors (e.g., Color Sensor, Fingerprint, ECG, Soil Moisture)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-5 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !prompt.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}