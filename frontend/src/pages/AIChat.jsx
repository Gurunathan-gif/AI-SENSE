import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Send, Bot, User, Copy, Save, Trash2, Sparkles, Zap, Cpu, Layers, Key, CheckCircle2, Server } from "lucide-react";
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
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const [showKeyInput, setShowKeyInput] = useState(false);

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

  const handleApiKeyChange = (val) => {
    setGeminiApiKey(val);
    localStorage.setItem("gemini_api_key", val.trim());
  };

  const handleSend = async (customPrompt) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim()) return;

    const userMessage = { type: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await generateCode(textToSend, boardTarget, geminiApiKey);
      const aiMessage = {
        type: "ai",
        code: res.code || (typeof res === "string" ? res : JSON.stringify(res, null, 2)),
        wiring: res.wiring || [],
        components: res.componentsNeeded || [],
        title: res.title || "Generated Program",
        source: res.source || "Google Gemini AI Engine"
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
          source: "Local Fallback"
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
          <p className="text-xs text-gray-400 mt-1">Google Gemini Powered AI Generator</p>

          <button
            onClick={clearChat}
            className="mt-6 w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
          >
            <Trash2 size={16} /> Clear Session
          </button>

          {/* Board Selector */}
          <div className="mt-6">
            <h2 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-2">
              Target Platform / Board
            </h2>
            <select
              value={boardTarget}
              onChange={(e) => setBoardTarget(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-blue-400 font-bold focus:outline-none"
            >
              <option value="Arduino UNO Q (32-Bit ARM)">Arduino UNO Q</option>
              <option value="Arduino UNO R3">Arduino UNO R3</option>
              <option value="ESP32 (Wi-Fi + Bluetooth)">ESP32 DevKit</option>
              <option value="Raspberry Pi Pico">Raspberry Pi Pico</option>
              <option value="Python Software Script">Python Software</option>
              <option value="JavaScript / Web App">JavaScript / Web App</option>
            </select>
          </div>

          {/* Gemini API Key Bar */}
          <div className="mt-6 bg-slate-950 p-4 rounded-2xl border border-blue-500/30 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-blue-400">
              <span className="flex items-center gap-1.5"><Key size={14} /> Gemini API Key</span>
              <button
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="text-[10px] text-gray-400 hover:text-white underline"
              >
                {showKeyInput ? "Hide" : "Configure"}
              </button>
            </div>
            {showKeyInput && (
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="Paste Google Gemini API Key..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-blue-500"
              />
            )}
            <div className="text-[10px] text-gray-400 flex items-center gap-1">
              <CheckCircle2 size={12} className={geminiApiKey ? "text-green-400" : "text-gray-500"} />
              {geminiApiKey ? "Custom Gemini Key Saved" : "Connected via System Gemini Engine"}
            </div>
          </div>

          {/* 100 Sensor Direct Selector */}
          <div className="mt-6">
            <h2 className="text-xs font-extrabold uppercase text-blue-400 tracking-wider mb-2 flex items-center gap-1.5">
              <Layers size={14} /> Pick from 100 Sensors
            </h2>
            <select
              value={selectedLibrarySensor}
              onChange={(e) => handleSelectFrom100Sensors(e.target.value)}
              className="w-full bg-slate-950 border border-blue-500/30 rounded-xl p-3 text-xs text-white font-semibold focus:outline-none"
            >
              <option value="">-- Choose Any Sensor --</option>
              {ALL_100_SENSORS.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.id} {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300 mt-4">
          <Zap className="w-4 h-4 text-blue-400 mb-1" />
          Generates code for <strong>ANY software or hardware prompt</strong> using Google Gemini!
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
            <p className="text-xs text-gray-400 mt-0.5">Google Gemini AI Engine — Generate software code, algorithms & embedded programs</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" /> Google Gemini AI Engine
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              {boardTarget}
            </span>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mx-auto">
                <Bot size={36} />
              </div>
              <h3 className="text-xl font-bold text-white">What program or code do you want to generate?</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Type any prompt (hardware sensors, Python, JavaScript, HTML, C++, algorithms, APIs, or robotics)!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto pt-4">
                <button
                  onClick={() => {
                    const pr = "Write code for Arduino UNO Q to read TCS3200 color sensor and trigger relay lock";
                    setPrompt(pr); handleSend(pr);
                  }}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 text-left text-xs font-bold text-blue-400 hover:text-white transition"
                >
                  <div className="mb-1 text-white">📡 Color Sensor & Relay</div>
                  <div className="text-[10px] text-gray-400 font-normal">Arduino C++ Hardware</div>
                </button>
                <button
                  onClick={() => {
                    const pr = "Write a Python script to filter and sort a list of dictionary records";
                    setPrompt(pr); handleSend(pr);
                  }}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 text-left text-xs font-bold text-blue-400 hover:text-white transition"
                >
                  <div className="mb-1 text-white">🐍 Python Data Script</div>
                  <div className="text-[10px] text-gray-400 font-normal">Software / Data Processing</div>
                </button>
                <button
                  onClick={() => {
                    const pr = "Write a C++ program for binary search tree with insertion and traversal";
                    setPrompt(pr); handleSend(pr);
                  }}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 text-left text-xs font-bold text-blue-400 hover:text-white transition"
                >
                  <div className="mb-1 text-white">⚡ C++ Binary Search Tree</div>
                  <div className="text-[10px] text-gray-400 font-normal">Data Structures & Algorithm</div>
                </button>
                <button
                  onClick={() => {
                    const pr = "Create an HTML and JavaScript calculator app with CSS grid styling";
                    setPrompt(pr); handleSend(pr);
                  }}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 text-left text-xs font-bold text-blue-400 hover:text-white transition"
                >
                  <div className="mb-1 text-white">🌐 JavaScript Calculator</div>
                  <div className="text-[10px] text-gray-400 font-normal">Web Application Code</div>
                </button>
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
                        {msg.title || "Generated Program"}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        Source: {msg.source || "Google Gemini AI Engine"}
                      </span>
                    </div>

                    <pre className="whitespace-pre-wrap overflow-x-auto text-green-400 font-mono text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-96">
                      {msg.code}
                    </pre>

                    {msg.wiring && msg.wiring.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <span className="text-xs font-bold text-gray-300">Execution / Circuit Notes:</span>
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
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-blue-400 font-bold animate-pulse flex items-center gap-2">
                <Sparkles size={16} className="animate-spin" /> Google Gemini AI is synthesizing your program...
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
              placeholder="Ask Google Gemini AI for ANY program (Python, JavaScript, C++, HTML, sensors, motors)..."
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