import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { updateLiveTelemetry } from "../services/telemetryService";

const HardwareContext = createContext();

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

export function HardwareProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [hardwareInfo, setHardwareInfo] = useState(null);
  const [telemetryData, setTelemetryData] = useState({});
  const [serialLogs, setSerialLogs] = useState([]);
  const [connectionError, setConnectionError] = useState("");
  const [deviceWarning, setDeviceWarning] = useState("");
  const [baudRate, setBaudRate] = useState("115200");

  const portRef = useRef(null);
  const readerRef = useRef(null);

  // Global physical USB disconnection detection listener
  useEffect(() => {
    if (!("serial" in navigator)) return;

    const handleHardwareDisconnect = (event) => {
      if (portRef.current && event.target === portRef.current) {
        setIsConnected(false);
        setHardwareInfo(null);
        setTelemetryData({});
        setSerialLogs((prev) => [...prev, `[SYSTEM] 🔴 Physical USB Cable Disconnected.`]);
        portRef.current = null;
      }
    };

    navigator.serial.addEventListener("disconnect", handleHardwareDisconnect);
    return () => {
      navigator.serial.removeEventListener("disconnect", handleHardwareDisconnect);
    };
  }, []);

  const connectHardwarePort = async (requestedBaud = "115200") => {
    setConnectionError("");
    setDeviceWarning("");

    if (!("serial" in navigator)) {
      setConnectionError("WebSerial API is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return false;
    }

    try {
      let port;
      try {
        port = await navigator.serial.requestPort({
          filters: MICROCONTROLLER_USB_FILTERS
        });
      } catch (filterErr) {
        if (filterErr.name === "NotFoundError") throw filterErr;
        // Fallback for Bluetooth serial blocklist warnings
        port = await navigator.serial.requestPort();
      }

      const info = port.getInfo();
      const vid = info.usbVendorId;
      const pid = info.usbProductId;

      const isValidMicrocontroller = vid && MICROCONTROLLER_USB_FILTERS.some((f) => f.usbVendorId === vid);

      if (!isValidMicrocontroller && vid !== undefined) {
        setDeviceWarning(`Device Notice: Selected USB device (Vendor ID: 0x${vid.toString(16).toUpperCase()}) connected.`);
      }

      const baudToUse = parseInt(requestedBaud, 10);
      await port.open({ baudRate: baudToUse });

      const boardName = vid ? identifyMicrocontrollerBoard(vid) : "Connected Microcontroller";
      const hexVid = vid ? `0x${vid.toString(16).toUpperCase()}` : "N/A";
      const hexPid = pid ? `0x${pid.toString(16).toUpperCase()}` : "N/A";

      portRef.current = port;
      setBaudRate(requestedBaud);
      setIsConnected(true);
      setHardwareInfo({ boardName, hexVid, hexPid });

      setSerialLogs((prev) => [
        ...prev,
        `[SYSTEM] 🟢 Hardware Verified: ${boardName} (VID: ${hexVid}, PID: ${hexPid}) connected at ${requestedBaud} Baud.`
      ]);

      readSerialStream(port);
      return true;
    } catch (err) {
      console.error("Hardware serial connection error:", err);
      if (err.name === "AccessDeniedError" || err.message.includes("locked") || err.message.includes("open")) {
        setConnectionError("COM Port Access Denied: The serial port is currently in use by another application (e.g. Arduino IDE Serial Monitor). Please close any other terminal and retry.");
      } else if (err.name === "NotFoundError" || err.message.includes("selected")) {
        setConnectionError("No hardware device selected. Please connect your Arduino UNO Q, STM32, or ESP32 board.");
      } else {
        setConnectionError(`Serial Connection Error: ${err.message}`);
      }
      return false;
    }
  };

  const readSerialStream = async (port) => {
    try {
      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      readerRef.current = reader;

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          buffer += value;
          const lines = buffer.split("\n");
          buffer = lines.pop();

          for (const line of lines) {
            const cleanLine = line.trim();
            if (cleanLine) {
              setSerialLogs((prev) => [...prev.slice(-300), `[${new Date().toLocaleTimeString()}] ${cleanLine}`]);

              let parsed = {};
              if (cleanLine.includes("TELEMETRY|")) {
                const parts = cleanLine.replace("TELEMETRY|", "").split("|");
                parts.forEach((p) => {
                  const [k, v] = p.split(":");
                  if (k && v) parsed[k.trim()] = v.trim();
                });
                setTelemetryData((prev) => ({ ...prev, ...parsed }));
              }

              updateLiveTelemetry(parsed, cleanLine);
            }
          }
        }
      }
    } catch (err) {
      console.error("Stream read error:", err);
    } finally {
      if (readerRef.current) {
        try { readerRef.current.releaseLock(); } catch (e) {}
      }
    }
  };

  const disconnectHardwarePort = async () => {
    try {
      if (readerRef.current) await readerRef.current.cancel();
      if (portRef.current) await portRef.current.close();
    } catch (e) {
      console.error(e);
    }
    setIsConnected(false);
    setHardwareInfo(null);
    setTelemetryData({});
    setSerialLogs((prev) => [...prev, `[SYSTEM] Hardware serial port disconnected manually.`]);
    portRef.current = null;
  };

  const sendSerialCommand = async (cmd) => {
    if (!cmd || !cmd.trim() || !portRef.current) return;
    try {
      const encoder = new TextEncoder();
      const writer = portRef.current.writable.getWriter();
      await writer.write(encoder.encode(cmd + "\n"));
      writer.releaseLock();
      setSerialLogs((prev) => [...prev, `[SENT] ${cmd}`]);
    } catch (err) {
      alert("Failed to send command to hardware: " + err.message);
    }
  };

  const clearSerialLogs = () => setSerialLogs([]);

  return (
    <HardwareContext.Provider
      value={{
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
      }}
    >
      {children}
    </HardwareContext.Provider>
  );
}

export function useHardware() {
  return useContext(HardwareContext);
}
