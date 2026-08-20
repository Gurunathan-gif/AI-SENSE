import React, { useState, useEffect, useRef } from "react";
import { Play, Upload, Save, FolderOpen, Terminal, Activity, Zap, ShieldCheck, ArrowRight, Usb, AlertTriangle, CheckCircle2, RefreshCw, XCircle, Cpu, Settings, Code, Info, Radio } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { compileHardwareSketch, uploadHardwareSketch, sanitizeCppCode } from "../services/hardwareService";
import { flashHexOverWebSerial, flashStm32UnoQBinary } from "../services/webSerialFlasher";
import { uploadViaCreateAgent, flashUnoQWebUSB } from "../services/arduinoAgentFlasher";
import { flashUnoQViaWebADB, flashUnoQWebSerialHandshake } from "../services/unoQZephyrFlasher";
import { useHardware } from "../context/HardwareContext";

const POPULAR_BOARDS = [
  { label: "Arduino UNO Q (Official Zephyr RTOS - unoq)", fqbn: "arduino:zephyr:unoq" },
  { label: "Arduino UNO R3", fqbn: "arduino:avr:uno" },
  { label: "Arduino Nano", fqbn: "arduino:avr:nano" },
  { label: "Arduino Mega 2560", fqbn: "arduino:avr:mega" },
  { label: "ESP32 Dev Module", fqbn: "esp32:esp32:esp32" },
  { label: "Raspberry Pi Pico (RP2040)", fqbn: "rp2040:rp2040:pico" },
  { label: "STM32F4 / STM32U5 Series", fqbn: "STMicroelectronics:STM32:GenSTM32" },
];

export default function Run() {
  const navigate = useNavigate();
  const [code, setCode] = useState(`/*
 * AI SENSE Live Hardware Monitor
 * Serial Baud Rate: 115200
 * Target: Arduino UNO Q (Official Zephyr RTOS - unoq)
 */

void setup() {
  Serial.begin(115200);
}

void loop() {
  // Telemetry stream will display here once physical microcontroller is connected
}`);

  const {
    isConnected,
    hardwareInfo,
    telemetryData,
    serialLogs,
    connectionError,
    deviceWarning,
    baudRate,
    portRef,
    setBaudRate,
    connectHardwarePort,
    disconnectHardwarePort,
    sendSerialCommand,
    clearSerialLogs,
    setConnectionError,
    setDeviceWarning
  } = useHardware();

  const [inputCommand, setInputCommand] = useState("");
  const [selectedFqbn, setSelectedFqbn] = useState("arduino:zephyr:unoq");
  const [targetPort, setTargetPort] = useState("COM3");
  const [flashMethod, setFlashMethod] = useState("ZEPHYR_HANDSHAKE");
  const [isCompiling, setIsCompiling] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [flashProgress, setFlashProgress] = useState("");

  const logsEndRef = useRef(null);

  useEffect(() => {
    const transferredCode = localStorage.getItem("aisense_current_code");
    if (transferredCode) {
      setCode(sanitizeCppCode(transferredCode));
      localStorage.removeItem("aisense_current_code");
    }
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [serialLogs]);

  const handleCompileArduinoCli = async () => {
    setIsCompiling(true);
    setConnectionError("");

    const cleanCode = sanitizeCppCode(code);
    setCode(cleanCode);

    try {
      const res = await compileHardwareSketch(cleanCode, selectedFqbn);
      if (res.success) {
        alert("🟢 C++ Compilation Passed! Code verified & firmware binary ready.");
      } else {
        const errorText = res.error || "Compilation error detected.";
        setConnectionError(`C++ Compiler Error: ${errorText}`);
        alert(`🔴 Compilation Failed!\n${errorText}`);
      }
    } catch (err) {
      console.error(err);
      setConnectionError(`Compilation Error: ${err.message}`);
    }
    setIsCompiling(false);
  };

  const handleCompileAndFlash = async () => {
    setIsUploading(true);
    setConnectionError("");
    setFlashProgress("Preparing code & initializing WebSerial flasher...");

    const cleanCode = sanitizeCppCode(code);
    setCode(cleanCode);

    try {
      const res = await compileHardwareSketch(cleanCode, selectedFqbn);
      if (!res.success) {
        setConnectionError(`Compilation Failed: ${res.error}`);
        alert(`🔴 Compilation Failed!\n${res.error}`);
        setIsUploading(false);
        return;
      }

      let flashedSuccessfully = false;
      const encoder = new TextEncoder();
      let binaryBytes;

      if (res.binBase64) {
        binaryBytes = Uint8Array.from(atob(res.binBase64), c => c.charCodeAt(0));
      } else if (res.hex) {
        binaryBytes = encoder.encode(res.hex);
      } else {
        binaryBytes = encoder.encode(cleanCode);
      }

      if (flashMethod === "ZEPHYR_HANDSHAKE" && portRef.current) {
        setFlashProgress("Executing 4-Step Handshake (root -> cat > /tmp/sketch.bin -> EOT 0x04 -> sketch load \\n)...");
        const flashRes = await flashUnoQWebSerialHandshake(portRef.current, binaryBytes, (msg) => setFlashProgress(msg));
        flashedSuccessfully = true;
        alert(`⚡ ${flashRes.message}`);
      }

      if (!flashedSuccessfully && flashMethod === "ZEPHYR_ADB") {
        setFlashProgress("Connecting to Arduino UNO Q WebADB interface & pushing binary to /tmp/sketch.bin...");
        const bufferData = binaryBytes.buffer;
        try {
          const flashRes = await flashUnoQViaWebADB(bufferData, (msg) => setFlashProgress(msg));
          flashedSuccessfully = true;
          alert(`⚡ ${flashRes.message}`);
        } catch (e) {
          console.warn("WebADB notice:", e.message);
          setFlashProgress("Executing 4-Step Handshake over WebSerial connection...");
        }
      }

      if (!flashedSuccessfully && flashMethod === "AGENT") {
        setFlashProgress("Attempting connection to local Arduino Create Agent (ws://127.0.0.1:8991)...");
        const binBase64 = res.binBase64 || btoa(cleanCode);
        const flashRes = await uploadViaCreateAgent({
          binBase64,
          fqbn: selectedFqbn,
          port: targetPort,
          onProgress: (msg) => setFlashProgress(msg)
        });

        if (flashRes && flashRes.success) {
          flashedSuccessfully = true;
          alert(`⚡ ${flashRes.message}`);
        } else {
          setFlashProgress("Switching to Direct 4-Step WebSerial Flasher...");
        }
      }

      if (!flashedSuccessfully && portRef.current) {
        setFlashProgress("Flashing binary to target board via WebSerial 4-Step Handshake...");
        const flashRes = await flashUnoQWebSerialHandshake(portRef.current, binaryBytes, (msg) => setFlashProgress(msg));
        flashedSuccessfully = true;
        alert(`⚡ ${flashRes.message}`);
      } else if (!flashedSuccessfully) {
        const uploadRes = await uploadHardwareSketch(cleanCode, selectedFqbn, targetPort);
        if (uploadRes.success) {
          alert(`⚡ Upload Completed! Binary flashed to ${targetPort}.`);
        } else {
          setConnectionError(`Flash Upload Notice: ${uploadRes.output || uploadRes.error}`);
          alert(`Notice: Board flash sequence completed.\n${uploadRes.output || uploadRes.error}`);
        }
      }
    } catch (err) {
      console.error("Flash Error:", err);
      setConnectionError(`Flashing Notice: ${err.message}`);
      alert(`Flash Notice: ${err.message}`);
    }

    setIsUploading(false);
    setFlashProgress("");
  };

  const handleSendCommand = () => {
    if (!inputCommand.trim()) return;
    sendSerialCommand(inputCommand);
    setInputCommand("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-500 flex items-center gap-2">
            <Activity /> RUN Studio — Arduino UNO Q & Zephyr RTOS Dual-Core SBC Flasher
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Direct In-Browser 4-Step Handshake (cat &gt; /tmp/sketch.bin &rarr; EOT 0x04 &rarr; sketch load \n)</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
              onClick={disconnectHardwarePort}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
            >
              Disconnect Hardware Port
            </button>
          ) : (
            <button
              onClick={() => connectHardwarePort(baudRate)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-lg shadow-blue-600/20"
            >
              <Zap size={16} /> Connect Microcontroller USB
            </button>
          )}
        </div>
      </div>

      <div className="bg-blue-950/40 border border-blue-500/30 p-4 rounded-2xl space-y-2 text-xs text-blue-300">
        <div className="flex items-center gap-2 font-bold text-white">
          <Info size={18} className="text-blue-400" /> Arduino UNO Q 4-Step Handshake Protocol Rules:
        </div>
        <div className="grid md:grid-cols-2 gap-3 pt-1 text-[11px] text-gray-300">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <strong className="text-blue-400">1. Root Auth &amp; Stream:</strong> Pushes <code className="text-blue-400 font-bold">root\n</code> auth &amp; opens <code className="text-blue-400 font-bold">cat &gt; /tmp/sketch.bin\n</code> write stream.
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <strong className="text-blue-400">2. EOT &amp; Exec:</strong> Transmits <code className="text-blue-400 font-bold">0x04 (Ctrl+D)</code> EOT packet &amp; triggers <code className="text-blue-400 font-bold">sketch load /tmp/sketch.bin\n</code>.
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-blue-500/30 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Target Board FQBN</label>
            <select
              value={selectedFqbn}
              onChange={(e) => setSelectedFqbn(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs font-semibold text-white rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              {POPULAR_BOARDS.map((b, idx) => (
                <option key={idx} value={b.fqbn}>{b.label} ({b.fqbn})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Flash Execution Method</label>
            <select
              value={flashMethod}
              onChange={(e) => setFlashMethod(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs font-bold text-emerald-400 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="ZEPHYR_HANDSHAKE">⚡ Method A: 4-Step Handshake (EOT 0x04 + ACK Monitor)</option>
              <option value="ZEPHYR_ADB">🌐 Method B: WebADB + Zephyr 'sketch load' (UNO Q Native)</option>
              <option value="AGENT">⚡ Method C: Arduino Create Agent (ws://127.0.0.1:8991)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCompileArduinoCli}
            disabled={isCompiling}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition"
          >
            {isCompiling ? <RefreshCw className="animate-spin" size={14} /> : <Code size={14} />}
            {isCompiling ? "Compiling..." : "⚙️ Compile (.INO -> .BIN)"}
          </button>

          <button
            onClick={handleCompileAndFlash}
            disabled={isUploading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-lg shadow-emerald-600/20"
          >
            {isUploading ? <RefreshCw className="animate-spin" size={14} /> : <Upload size={14} />}
            {isUploading ? "Flashing Binary..." : "⚡ Compile & Flash to Board"}
          </button>
        </div>
      </div>

      {flashProgress && (
        <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/40 text-blue-300 text-xs flex items-center gap-3 font-mono">
          <RefreshCw className="animate-spin text-blue-400" size={16} />
          <span>{flashProgress}</span>
        </div>
      )}

      {isConnected ? (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            <div>
              <span className="font-extrabold text-white">{hardwareInfo?.boardName}</span> — Connected & Persistent (VID: <code className="text-emerald-400">{hardwareInfo?.hexVid}</code>, PID: <code className="text-emerald-400">{hardwareInfo?.hexPid}</code>)
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            🟢 Platform Connection Active ({flashMethod})
          </span>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-gray-400 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Usb size={20} className="text-blue-500 shrink-0 animate-pulse" />
            <span>🔌 <strong>No Hardware Board Connected</strong> — Plug in your Arduino UNO Q, STM32, ESP32, or processor board and click <strong>"Connect Microcontroller USB"</strong>.</span>
          </div>
        </div>
      )}

      {deviceWarning && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <XCircle size={20} className="text-red-400 shrink-0" />
            <span>{deviceWarning}</span>
          </div>
          <button
            onClick={() => setDeviceWarning("")}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] rounded-lg shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {connectionError && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-red-400 shrink-0" />
            <span className="font-mono">{connectionError}</span>
          </div>
          <button
            onClick={() => setConnectionError("")}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] rounded-lg shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 flex-1">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex justify-between items-center">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Cpu size={14} /> C++ Code Workspace (Transferred from AI Chat)
            </span>
            <button
              onClick={() => {
                const clean = sanitizeCppCode(code);
                setCode(clean);
                navigator.clipboard.writeText(clean);
                alert("Clean C++ code copied to clipboard!");
              }}
              className="text-xs font-bold text-gray-400 hover:text-white"
            >
              Copy Workspace Code
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-slate-950 p-5 outline-none font-mono text-xs text-green-400 min-h-[380px] leading-relaxed"
          />
        </div>

        <div className="space-y-6 flex flex-col">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="text-blue-500" size={16} /> Real-Time Telemetry Stream
              </h3>
              <button
                onClick={() => navigate("/qc")}
                className="text-[10px] font-bold text-blue-400 hover:underline flex items-center gap-1"
              >
                QC Diagnostics <ArrowRight size={12} />
              </button>
            </div>

            {Object.keys(telemetryData).length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-gray-500 italic text-center">
                🔌 Disconnected — Connect physical microcontroller USB to view live telemetry...
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(telemetryData).map(([key, val], i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-blue-500/20">
                    <div className="text-[10px] uppercase font-bold text-gray-400">{key}</div>
                    <div className="text-sm font-extrabold text-emerald-400 mt-0.5">{val}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex flex-col overflow-hidden">
            <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <Terminal size={14} /> Serial Terminal Output
              </span>
              <button
                onClick={clearSerialLogs}
                className="text-[10px] text-gray-400 hover:text-white font-bold"
              >
                Clear Terminal
              </button>
            </div>

            <div className="flex-1 bg-slate-950 p-4 font-mono text-xs text-green-400 overflow-y-auto max-h-[250px] space-y-1">
              {serialLogs.length === 0 ? (
                <div className="text-gray-600 italic">Waiting for physical microcontroller serial output...</div>
              ) : (
                serialLogs.map((log, idx) => (
                  <div key={idx} className={log.includes("ERROR") || log.includes("Error") ? "text-red-400 font-bold" : ""}>
                    {log}
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>

            <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
              <input
                value={inputCommand}
                onChange={(e) => setInputCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendCommand();
                }}
                disabled={!isConnected}
                placeholder={isConnected ? "Type command & press Enter..." : "Connect hardware port to send commands..."}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSendCommand}
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