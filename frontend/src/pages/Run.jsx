import React, { useState, useEffect, useRef } from "react";
import { Play, Upload, Save, FolderOpen, Terminal, Activity, Zap, ShieldCheck, ArrowRight, Usb, AlertTriangle, CheckCircle2, RefreshCw, XCircle, Cpu, Settings, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { updateLiveTelemetry } from "../services/telemetryService";
import { compileHardwareSketch, uploadHardwareSketch, fetchConnectedBoards, getHardwareStatus } from "../services/hardwareService";

// Recognized Microcontroller & Single Board Computer USB Vendor IDs (VIDs)
const MICROCONTROLLER_USB_FILTERS = [
  { usbVendorId: 0x2341 }, // Arduino SA (UNO Q, UNO R3, Mega, Nano)
  { usbVendorId: 0x2A03 }, // Arduino.org
  { usbVendorId: 0x05C6 }, // Qualcomm Inc (Arduino UNO Q / Dragonwing QRB2210 AP)
  { usbVendorId: 0x0483 }, // STMicroelectronics (STM32U585 / ST-Link Coprocessor)
  { usbVendorId: 0x303A }, // Espressif Systems (ESP32 / ESP32-S3 / ESP32-C3)
  { usbVendorId: 0x10C4 }, // Silicon Labs CP210x (ESP32 / NodeMCU Serial Bridge)
  { usbVendorId: 0x1A86 }, // QinHeng CH340 / CH341 (Arduino / ESP32 Serial Bridge)
  { usbVendorId: 0x0403 }, // FTDI FT232R Transceiver
  { usbVendorId: 0x2E8A }, // Raspberry Pi Ltd (Raspberry Pi Pico / RP2040)
  { usbVendorId: 0x16C0 }  // PJRC Teensy
];

const POPULAR_BOARDS = [
  { label: "Arduino UNO Q (32-Bit ARM + QRB2210)", fqbn: "arduino:samd:nano_33_iot" },
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
 * Target: Arduino UNO Q (Qualcomm QRB2210 AP + STM32U585 Coprocessor)
 */

void setup() {
  Serial.begin(115200);
}

void loop() {
  // Telemetry stream will display here once physical microcontroller is connected
}`);

  const [serialLogs, setSerialLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [baudRate, setBaudRate] = useState("115200");
  const [hardwareInfo, setHardwareInfo] = useState(null);
  const [telemetryData, setTelemetryData] = useState({});
  const [inputCommand, setInputCommand] = useState("");
  const [connectionError, setConnectionError] = useState("");
  const [deviceWarning, setDeviceWarning] = useState("");

  // Arduino CLI State
  const [selectedFqbn, setSelectedFqbn] = useState("arduino:avr:uno");
  const [targetPort, setTargetPort] = useState("COM3");
  const [isCompiling, setIsCompiling] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [cliStatus, setCliStatus] = useState(null);

  const logsEndRef = useRef(null);
  const portRef = useRef(null);
  const readerRef = useRef(null);

  // Check if AI Chat transferred code to RUN Studio
  useEffect(() => {
    const transferredCode = localStorage.getItem("aisense_current_code");
    if (transferredCode) {
      setCode(transferredCode);
      localStorage.removeItem("aisense_current_code");
    }

    // Check Arduino CLI toolchain status on backend
    getHardwareStatus().then((res) => {
      if (res && res.arduinoCli) {
        setCliStatus(res.arduinoCli);
      }
    });
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [serialLogs]);

  // Identify Vendor ID name
  const identifyMicrocontrollerBoard = (vid) => {
    switch (vid) {
      case 0x2341:
      case 0x2A03:
        return "Arduino UNO Q / Official Arduino Board";
      case 0x05C6:
        return "Qualcomm Dragonwing QRB2210 AP (Arduino UNO Q)";
      case 0x0483:
        return "STM32U585 ARM Cortex-M33 Coprocessor";
      case 0x303A:
        return "Espressif ESP32 Microcontroller";
      case 0x10C4:
        return "Silicon Labs CP210x USB Bridge (ESP32 / NodeMCU)";
      case 0x1A86:
        return "WCH CH340 USB-Serial Transceiver (Arduino / ESP)";
      case 0x0403:
        return "FTDI FT232R USB Transceiver";
      case 0x2E8A:
        return "Raspberry Pi Pico (RP2040)";
      default:
        return "Generic USB Microcontroller";
    }
  };

  // Compile Sketch via Arduino CLI Backend Endpoint
  const handleCompileArduinoCli = async () => {
    setIsCompiling(true);
    setSerialLogs((prev) => [
      ...prev,
      `[ARDUINO-CLI] ⚙️ Starting C++ compilation for target FQBN: ${selectedFqbn}...`
    ]);

    try {
      const res = await compileHardwareSketch(code, selectedFqbn);
      if (res.success) {
        setSerialLogs((prev) => [
          ...prev,
          `[ARDUINO-CLI] 🟢 COMPILATION PASSED!`,
          ...(res.output ? res.output.split("\n") : [])
        ]);
      } else {
        setSerialLogs((prev) => [
          ...prev,
          `[ARDUINO-CLI] 🔴 COMPILATION ERROR:`,
          ...(res.output ? res.output.split("\n") : [res.error || "Unknown compilation error."])
        ]);
      }
    } catch (err) {
      setSerialLogs((prev) => [...prev, `[ARDUINO-CLI] 🔴 Error: ${err.message}`]);
    }
    setIsCompiling(false);
  };

  // Upload Sketch via Arduino CLI Backend Endpoint
  const handleUploadArduinoCli = async () => {
    setIsUploading(true);
    setSerialLogs((prev) => [
      ...prev,
      `[ARDUINO-CLI] ⚡ Initiating upload to Port: ${targetPort} (FQBN: ${selectedFqbn})...`
    ]);

    try {
      const res = await uploadHardwareSketch(code, selectedFqbn, targetPort);
      if (res.success) {
        setSerialLogs((prev) => [
          ...prev,
          `[ARDUINO-CLI] 🟢 UPLOAD SUCCESSFUL! Code flashed to ${targetPort}.`,
          ...(res.output ? res.output.split("\n") : [])
        ]);
      } else {
        setSerialLogs((prev) => [
          ...prev,
          `[ARDUINO-CLI] 🔴 UPLOAD FAILED:`,
          ...(res.output ? res.output.split("\n") : [res.error || "Upload failed."])
        ]);
      }
    } catch (err) {
      setSerialLogs((prev) => [...prev, `[ARDUINO-CLI] 🔴 Error: ${err.message}`]);
    }
    setIsUploading(false);
  };

  // WebSerial Connect Handler with Hardware Port Verification
  const handleConnectSerial = async () => {
    setConnectionError("");
    setDeviceWarning("");

    if (!("serial" in navigator)) {
      setConnectionError("WebSerial API is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    try {
      // Filter WebSerial USB picker to only show recognized microcontrollers
      const port = await navigator.serial.requestPort({
        filters: MICROCONTROLLER_USB_FILTERS
      });

      const info = port.getInfo();
      const vid = info.usbVendorId;
      const pid = info.usbProductId;

      // Verify if device is a valid microcontroller
      const isValidMicrocontroller = vid && MICROCONTROLLER_USB_FILTERS.some(f => f.usbVendorId === vid);

      if (!isValidMicrocontroller && vid !== undefined) {
        setDeviceWarning(`Device Rejected: Selected USB device (Vendor ID: 0x${vid.toString(16).toUpperCase()}) is not a recognized microcontroller or single-board computer processor.`);
        return;
      }

      await port.open({ baudRate: parseInt(baudRate, 10) });

      const boardName = vid ? identifyMicrocontrollerBoard(vid) : "Connected Microcontroller";
      const hexVid = vid ? `0x${vid.toString(16).toUpperCase()}` : "N/A";
      const hexPid = pid ? `0x${pid.toString(16).toUpperCase()}` : "N/A";

      portRef.current = port;
      setIsConnected(true);
      setHardwareInfo({ boardName, hexVid, hexPid });

      setSerialLogs((prev) => [
        ...prev,
        `[SYSTEM] 🟢 Hardware Verified: ${boardName} (VID: ${hexVid}, PID: ${hexPid}) connected at ${baudRate} Baud.`
      ]);

      readSerialData(port);
    } catch (err) {
      console.error("Serial connection error:", err);
      if (err.name === "AccessDeniedError" || err.message.includes("locked") || err.message.includes("open")) {
        setConnectionError("COM Port Access Denied: The serial port is currently in use by another application (e.g. Arduino IDE Serial Monitor). Please close any other terminal and retry.");
      } else if (err.name === "NotFoundError" || err.message.includes("selected")) {
        setConnectionError("No hardware device selected. Please connect your Arduino UNO Q, STM32, or ESP32 board.");
      } else {
        setConnectionError(`Serial Connection Error: ${err.message}`);
      }
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

              // Interconnect live hardware serial telemetry output with QC Diagnostics
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
    setHardwareInfo(null);
    setTelemetryData({});
    setSerialLogs((prev) => [...prev, `[SYSTEM] Serial port disconnected.`]);
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
            <Activity /> RUN Hardware Studio & Arduino CLI Toolchain
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Arduino CLI C++ Compile & Flash engine + WebSerial live telemetry monitor</p>
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
              onClick={handleDisconnectSerial}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
            >
              Disconnect Hardware Port
            </button>
          ) : (
            <button
              onClick={handleConnectSerial}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-lg shadow-blue-600/20"
            >
              <Zap size={16} /> Connect WebSerial Monitor
            </button>
          )}
        </div>
      </div>

      {/* Arduino CLI Compilation & Flash Action Controls */}
      <div className="bg-slate-900 border border-blue-500/30 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Target Microcontroller FQBN</label>
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
            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Target Hardware Port</label>
            <input
              type="text"
              value={targetPort}
              onChange={(e) => setTargetPort(e.target.value)}
              placeholder="e.g. COM3, COM4, /dev/ttyACM0"
              className="bg-slate-950 border border-slate-800 text-xs font-mono text-blue-400 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 w-44"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCompileArduinoCli}
            disabled={isCompiling}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition"
          >
            {isCompiling ? <RefreshCw className="animate-spin" size={14} /> : <Code size={14} />}
            {isCompiling ? "Compiling..." : "⚙️ Compile Sketch (Arduino CLI)"}
          </button>

          <button
            onClick={handleUploadArduinoCli}
            disabled={isUploading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-lg shadow-emerald-600/20"
          >
            {isUploading ? <RefreshCw className="animate-spin" size={14} /> : <Upload size={14} />}
            {isUploading ? "Flashing Code..." : "⚡ Flash to Board (Arduino CLI)"}
          </button>
        </div>
      </div>

      {/* Hardware Connection Status Bar */}
      {hardwareInfo ? (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            <div>
              <span className="font-extrabold text-white">{hardwareInfo.boardName}</span> — Connected & Verified (VID: <code className="text-emerald-400">{hardwareInfo.hexVid}</code>, PID: <code className="text-emerald-400">{hardwareInfo.hexPid}</code>)
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Physical USB Hardware Port Active
          </span>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-gray-400 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Usb size={20} className="text-blue-500 shrink-0 animate-pulse" />
            <span>🔌 <strong>No WebSerial Stream Active</strong> — Plug in your Arduino UNO Q, STM32, ESP32, or processor board and click <strong>"Connect WebSerial Monitor"</strong> or compile using <strong>Arduino CLI</strong>.</span>
          </div>
        </div>
      )}

      {/* Connection Warning Banners */}
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
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-amber-400 shrink-0" />
            <span>{connectionError}</span>
          </div>
          <button
            onClick={() => setConnectionError("")}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] rounded-lg shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 flex-1">
        {/* Left 2 Cols: Code Editor Workspace */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex justify-between items-center">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Cpu size={14} /> C++ Code Workspace (Transferred from AI Chat)
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
                alert("Code copied to clipboard!");
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

        {/* Right Col: Real Hardware Telemetry & Serial Monitor */}
        <div className="space-y-6 flex flex-col">
          {/* Live Telemetry Display */}
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

          {/* Serial Terminal */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex flex-col overflow-hidden">
            <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <Terminal size={14} /> Serial Terminal & Arduino CLI Build Logs
              </span>
              <button
                onClick={() => setSerialLogs([])}
                className="text-[10px] text-gray-400 hover:text-white font-bold"
              >
                Clear Terminal
              </button>
            </div>

            <div className="flex-1 bg-slate-950 p-4 font-mono text-xs text-green-400 overflow-y-auto max-h-[250px] space-y-1">
              {serialLogs.length === 0 ? (
                <div className="text-gray-600 italic">Waiting for physical microcontroller serial output or Arduino CLI build logs...</div>
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
                placeholder={isConnected ? "Type command & press Enter..." : "Connect hardware port to send commands..."}
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