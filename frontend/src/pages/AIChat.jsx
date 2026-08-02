import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Copy, Save, Trash2, Sparkles, Play, Zap, Cpu } from "lucide-react";
import { generateCode } from "../services/aiService";
import { saveProject } from "../services/projectService";

const SENSOR_STARTERS = [
  { label: "📡 Ultrasonic Distance", prompt: "Create an Arduino code using HC-SR04 ultrasonic sensor to measure distance in cm. Sound buzzer and turn on LED if closer than 15cm." },
  { label: "🌡️ DHT11 Temp + Fan Relay", prompt: "Read temperature and humidity from DHT11 on pin D2. Activate 5V relay module on D7 if temperature exceeds 28°C." },
  { label: "💨 MQ-2 Gas Detector", prompt: "Read MQ-2 gas sensor on A0. Trigger buzzer alarm on D8 when gas reading exceeds 350." },
  { label: "🚶 PIR Motion Security", prompt: "Detect motion with HC-SR501 PIR sensor on D3. Blink LED on D13 and sound buzzer when motion is detected." },
  { label: "🌱 Soil Moisture Water Pump", prompt: "Read soil moisture on A0. If value drops below 400 ADC, trigger water pump relay for 3 seconds." },
  { label: "❤️ MAX30100 Pulse Oximeter", prompt: "Read heart rate BPM and SpO2 blood oxygen saturation using MAX30100 over I2C." },
  { label: "🌊 DS18B20 Waterproof Temp", prompt: "Read waterproof temperature probe DS18B20 on pin D2 with 4.7k pull-up resistor." },
  { label: "⚡ ACS712 Current Sensor", prompt: "Measure AC/DC current using ACS712 current sensor on A0 with 200 sample averaging." },
];

export default function AIChat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [boardTarget, setBoardTarget] = useState("Arduino UNO Q (32-Bit ARM)");

  const bottomRef = useRef(null);

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
          code: "// Error connecting to AI generation engine.\n// Make sure backend server is running on port 5000.",
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

          <div className="mt-8">
            <h2 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-3">
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

          <div className="mt-8 space-y-2">
            <h2 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-2">
              Quick Sensor Starters
            </h2>
            {SENSOR_STARTERS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(s.prompt);
                  handleSend(s.prompt);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 transition text-xs font-bold text-blue-400 truncate"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300">
          <Zap className="w-4 h-4 text-blue-400 mb-1" />
          Works with <strong>ANY</strong> sensor, even if unlisted! Just type its name.
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
            <p className="text-xs text-gray-400 mt-0.5">Generate Arduino C++ programs & circuit pinout schematics with natural language</p>
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
              <h3 className="text-xl font-bold text-white">What hardware program do you want to build?</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Type any prompt below or click a quick starter button. Supports all standard & exotic sensors!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto pt-4">
                {SENSOR_STARTERS.slice(0, 4).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPrompt(s.prompt);
                      handleSend(s.prompt);
                    }}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 text-left text-xs font-bold text-blue-400 hover:text-white transition"
                  >
                    <div className="mb-1">{s.label}</div>
                    <div className="text-[10px] text-gray-400 font-normal line-clamp-2">{s.prompt}</div>
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
              placeholder="Describe your hardware project or sensor logic (e.g. Read BME680 over I2C)..."
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