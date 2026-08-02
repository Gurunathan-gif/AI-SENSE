import React, { useState, useEffect, useRef } from "react";
import { Play, Upload, Save, FolderOpen, Terminal, Activity, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { updateLiveTelemetry } from "../services/telemetryService";

export default function Run() {
  const navigate = useNavigate();
  const [code, setCode] = useState(`/*
 * AI SENSE Live Hardware Monitor
 * Serial Baud Rate: 115200
 */

#define TRIG_PIN 9
#define ECHO_PIN 10

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH);
  float distance = (duration * 0.0343) / 2.0;

  Serial.print("TELEMETRY|DISTANCE:");
  Serial.print(distance, 1);
  Serial.println("CM");

  delay(500);
}`);

  const [serialLogs, setSerialLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [baudRate, setBaudRate] = useState("115200");
  const [portName, setPortName] = useState("");
  const [telemetryData, setTelemetryData] = useState({});
  const [inputCommand, setInputCommand] = useState("");

  const logsEndRef = useRef(null);
  const portRef = useRef(null);
  const readerRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [serialLogs]);

  // WebSerial Connect Handler
  const handleConnectSerial = async () => {
    if (!("serial" in navigator)) {
      alert("WebSerial API is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: parseInt(baudRate, 10) });

      portRef.current = port;
      setIsConnected(true);
      setPortName("Connected (WebSerial)");

      readSerialData(port);
    } catch (err) {
      console.error("Serial error:", err);
      alert("Failed to connect to serial port: " + err.message);
    }
  };

  const readSerialData = async (port) => {
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();
    readerRef.current = reader;

    let buffer = "";

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          buffer += value;
          const lines = buffer.split("\n");
          buffer = lines.pop(); // keep partial line

          for (const line of lines) {
            const cleanLine = line.trim();
            if (cleanLine) {
              setSerialLogs((prev) => [...prev.slice(-200), `[${new Date().toLocaleTimeString()}] ${cleanLine}`]);

              // Parse TELEMETRY format: TELEMETRY|TEMP:24.5C|HUMIDITY:55%
              let parsed = {};
              if (cleanLine.includes("TELEMETRY|")) {
                const parts = cleanLine.replace("TELEMETRY|", "").split("|");
                parts.forEach((p) => {
                  const [k, v] = p.split(":");
                  if (k && v) parsed[k.trim()] = v.trim();
                });
                setTelemetryData((prev) => ({ ...prev, ...parsed }));
              }

              // Interconnect live telemetry output with QC Diagnostics
              updateLiveTelemetry(parsed, cleanLine);
            }
          }
        }
      }
    } catch (err) {
      console.error("Read error:", err);
    } finally {
      reader.releaseLock();
    }
  };

  const handleDisconnectSerial = async () => {
    try {
      if (readerRef.current) await readerRef.current.cancel();
      if (portRef.current) await portRef.current.close();
    } catch (e) {
      console.error(e);
    }
    setIsConnected(false);
    setPortName("");
  };

  const sendSerialCommand = async () => {
    if (!inputCommand.trim() || !portRef.current) return;
    try {
      const encoder = new TextEncoder();
      const writer = portRef.current.writable.getWriter();
      await writer.write(encoder.encode(inputCommand + "\n"));
      writer.releaseLock();
      setSerialLogs((prev) => [...prev, `[SENT] ${inputCommand}`]);
      setInputCommand("");
    } catch (err) {
      alert("Failed to send command: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col p-6 space-y-6">
      {/* Top Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-500 flex items-center gap-2">
            <Activity /> RUN Hardware Studio & Serial Monitor
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Real-time WebSerial API hardware telemetry parser & C++ program workspace</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/qc")}
            className="bg-slate-950 hover:bg-slate-800 border border-blue-500/40 text-blue-400 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition"
          >
            <ShieldCheck size={16} /> Analyze in QC Diagnostics <ArrowRight size={14} />
          </button>

          <select
            value={baudRate}
            onChange={(e) => setBaudRate(e.target.value)}
            disabled={isConnected}
            className="bg-slate-950 border border-slate-800 text-xs font-bold text-blue-400 rounded-xl px-3 py-2.5 focus:outline-none"
          >
            <option value="9600">9600 Baud</option>
            <option value="57600">57600 Baud</option>
            <option value="115200">115200 Baud</option>
          </select>

          {isConnected ? (
            <button
              onClick={handleDisconnectSerial}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
            >
              Disconnect Serial
            </button>
          ) : (
            <button
              onClick={handleConnectSerial}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition"
            >
              <Zap size={16} /> Connect Arduino Serial
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 flex-1">
        {/* Left 2 Cols: Code Editor */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex justify-between items-center">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">C++ Code Editor</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
                alert("Code copied!");
              }}
              className="text-xs font-bold text-gray-400 hover:text-white"
            >
              Copy
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-slate-950 p-5 outline-none font-mono text-xs text-green-400 min-h-[350px] leading-relaxed"
          />
        </div>

        {/* Right Col: Live Telemetry & Serial Monitor */}
        <div className="space-y-6 flex flex-col">
          {/* Live Telemetry Display */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="text-blue-500" size={16} /> Real-Time Telemetry Dashboard
              </h3>
              <button
                onClick={() => navigate("/qc")}
                className="text-[10px] font-bold text-blue-400 hover:underline flex items-center gap-1"
              >
                QC Test <ArrowRight size={12} />
              </button>
            </div>
            {Object.keys(telemetryData).length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-gray-400">
                Connect Arduino over Serial to stream telemetry...
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(telemetryData).map(([key, val], i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-blue-500/20">
                    <div className="text-[10px] uppercase font-bold text-gray-400">{key}</div>
                    <div className="text-sm font-extrabold text-blue-400 mt-0.5">{val}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Serial Terminal */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex flex-col overflow-hidden">
            <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <Terminal size={14} /> Serial Terminal Console
              </span>
              <button
                onClick={() => setSerialLogs([])}
                className="text-[10px] text-gray-400 hover:text-white font-bold"
              >
                Clear
              </button>
            </div>

            <div className="flex-1 bg-slate-950 p-4 font-mono text-xs text-green-400 overflow-y-auto max-h-[250px] space-y-1">
              {serialLogs.length === 0 ? (
                <div className="text-gray-500 italic">Waiting for serial output...</div>
              ) : (
                serialLogs.map((log, idx) => <div key={idx}>{log}</div>)
              )}
              <div ref={logsEndRef} />
            </div>

            {/* Terminal Input */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
              <input
                value={inputCommand}
                onChange={(e) => setInputCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendSerialCommand();
                }}
                disabled={!isConnected}
                placeholder={isConnected ? "Type command & press Enter..." : "Connect serial to send commands..."}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-blue-500"
              />
              <button
                onClick={sendSerialCommand}
                disabled={!isConnected || !inputCommand.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}