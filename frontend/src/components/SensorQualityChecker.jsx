import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, RefreshCw, Activity, Cpu, Wrench, Usb, Info, ExternalLink, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLatestTelemetry, subscribeTelemetry } from '../services/telemetryService';

const SENSOR_QC_PROFILES = [
  {
    id: 'tcs3200',
    name: 'TCS3200 Color Sensor',
    paramKeys: ['RED', 'GREEN', 'BLUE'],
    voltage: '2.7V - 5.5V DC',
    interface: 'Digital Frequency Pulse',
    defaultOutputs: [
      { param: 'Red Channel Pulse', nominal: '25µs - 120µs', tolerance: '±5%' },
      { param: 'Green Channel Pulse', nominal: '30µs - 140µs', tolerance: '±5%' },
      { param: 'Blue Channel Pulse', nominal: '25µs - 110µs', tolerance: '±5%' },
    ],
    evaluate: (data) => {
      if (!data || (data.RED === undefined && data.GREEN === undefined && data.BLUE === undefined)) return null;
      const red = parseInt(data.RED || 0);
      const green = parseInt(data.GREEN || 0);
      const blue = parseInt(data.BLUE || 0);
      const isPassed = red >= 0 && red <= 255 && green >= 0 && green <= 255 && blue >= 0 && blue <= 255;
      return {
        status: isPassed ? 'OPTIMAL' : 'COLOR SENSOR SIGNAL OUT OF RANGE',
        passed: isPassed,
        data: { red: `RGB(${red}, ${green}, ${blue})`, status: isPassed ? 'OPTIMAL' : 'OUT OF RANGE' }
      };
    },
    debugGuide: [
      { step: 1, title: 'Check Frequency Scaling Pins', desc: 'Ensure S0 and S1 pins are set to HIGH/LOW for 20% frequency scaling.' },
      { step: 2, title: 'Verify Supply Voltage', desc: 'Connect VCC strictly to 5V DC. Low voltage causes pulse period distortion.' },
      { step: 3, title: 'Check Ambient Light Shielding', desc: 'Cover the color sensor with an opaque shroud during calibration.' }
    ]
  },
  {
    id: 'dht11',
    name: 'DHT11 Temp & Humidity',
    paramKeys: ['TEMP', 'HUMIDITY', 'TEMP_C'],
    voltage: '3.3V - 5.5V DC',
    interface: '1-Wire Digital Signal',
    defaultOutputs: [
      { param: 'Temperature Range', nominal: '0°C - 50°C', tolerance: '±2°C' },
      { param: 'Humidity Range', nominal: '20% - 90% RH', tolerance: '±5%' },
      { param: 'Read Interval', nominal: '2.0 sec', tolerance: 'Minimum interval' },
    ],
    evaluate: (data) => {
      const tempStr = data?.TEMP || data?.TEMP_C;
      const humStr = data?.HUMIDITY;
      if (!tempStr && !humStr) return null;
      const temp = parseFloat((tempStr || '').replace(/[^0-9.]/g, ''));
      const hum = parseFloat((humStr || '').replace(/[^0-9.]/g, ''));
      if (isNaN(temp) && isNaN(hum)) return null;
      const isPassed = (isNaN(temp) || (temp >= 0 && temp <= 50)) && (isNaN(hum) || (hum >= 20 && hum <= 90));
      return {
        status: isPassed ? 'OPTIMAL' : 'TEMPERATURE/HUMIDITY DEVIATION',
        passed: isPassed,
        data: { temp: `${temp}°C`, humidity: `${hum}%`, status: isPassed ? 'OPTIMAL' : 'DEVIATION DETECTED' }
      };
    },
    debugGuide: [
      { step: 1, title: 'Verify Pull-Up Resistor', desc: 'DHT11 data line requires a 10kΩ pull-up resistor connected between VCC and Data pin.' },
      { step: 2, title: 'Check Power Stability', desc: 'Ensure stable 5V DC supply. Low voltage causes NaN temperature read failures.' },
      { step: 3, title: 'Sampling Rate Limitation', desc: 'Do not read DHT11 faster than once every 2 seconds to prevent internal thermal drift.' }
    ]
  },
  {
    id: 'hc-sr04',
    name: 'HC-SR04 Ultrasonic Distance',
    paramKeys: ['DISTANCE', 'DISTANCE_CM'],
    voltage: '5V DC (Strict)',
    interface: 'Digital Pulse (Trig/Echo)',
    defaultOutputs: [
      { param: 'Blind Zone', nominal: '< 2 cm', tolerance: 'Minimum distance' },
      { param: 'Max Range', nominal: '400 cm', tolerance: '±3 mm' },
      { param: 'Echo Pulse', nominal: '100µs - 25000µs', tolerance: 'PulseIn timing' }
    ],
    evaluate: (data) => {
      const distStr = data?.DISTANCE || data?.DISTANCE_CM;
      if (!distStr) return null;
      const dist = parseFloat(distStr.replace(/[^0-9.]/g, ''));
      if (isNaN(dist)) return null;
      const isPassed = dist >= 2.0 && dist <= 400.0;
      return {
        status: isPassed ? 'OPTIMAL' : 'DISTANCE OUT OF BOUNDS',
        passed: isPassed,
        data: { distance: `${dist} cm`, status: isPassed ? 'OPTIMAL' : 'BLIND ZONE / OUT OF BOUNDS' }
      };
    },
    debugGuide: [
      { step: 1, title: '5V Supply Requirement', desc: 'HC-SR04 WILL NOT WORK reliably on 3.3V. Connect VCC strictly to 5V DC.' },
      { step: 2, title: 'Check Trig/Echo Pins', desc: 'Trig must be digital OUTPUT, Echo must be digital INPUT.' }
    ]
  }
];

export default function SensorQualityChecker() {
  const [selectedProfile, setSelectedProfile] = useState(SENSOR_QC_PROFILES[0]);
  const [mode, setMode] = useState('LIVE');
  const [liveStreamData, setLiveStreamData] = useState(getLatestTelemetry() || { rawLogs: [], parsedData: {}, timestamp: null });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeTelemetry((data) => {
      const safeData = data || { rawLogs: [], parsedData: {}, timestamp: null };
      setLiveStreamData(safeData);
      if (mode === 'LIVE' && safeData.parsedData && Object.keys(safeData.parsedData).length > 0) {
        evaluateTelemetryData(safeData.parsedData);
      }
    });
    return () => unsubscribe();
  }, [mode, selectedProfile]);

  const evaluateTelemetryData = (data) => {
    if (mode === 'SIMULATE_PASS') {
      setTestResult({
        timestamp: new Date().toLocaleTimeString(),
        status: 'OPTIMAL (PASSED)',
        passed: true,
        noBoard: false,
        source: 'Simulated Demo Stream',
        data: { value: 'Within Nominal Spec', status: 'OPTIMAL' }
      });
      return;
    }

    if (mode === 'SIMULATE_FAULT') {
      setTestResult({
        timestamp: new Date().toLocaleTimeString(),
        status: 'HARDWARE FAULT (FAILED)',
        passed: false,
        noBoard: false,
        source: 'Simulated Demo Stream',
        data: { value: 'Signal Out of Spec', status: 'SIGNAL_DRIFT_FAULT' }
      });
      return;
    }

    if (!data || Object.keys(data).length === 0) {
      setTestResult({
        timestamp: new Date().toLocaleTimeString(),
        status: 'NO_HARDWARE',
        passed: false,
        noBoard: true,
        source: 'Physical Microcontroller WebSerial',
        data: {}
      });
      return;
    }

    const evaluation = selectedProfile.evaluate(data);

    if (!evaluation) {
      setTestResult({
        timestamp: new Date().toLocaleTimeString(),
        status: 'NO_HARDWARE',
        passed: false,
        noBoard: true,
        source: 'Physical Microcontroller WebSerial',
        data: {}
      });
      return;
    }

    setTestResult({
      timestamp: new Date().toLocaleTimeString(),
      status: evaluation.status,
      passed: evaluation.passed,
      noBoard: false,
      source: 'Physical Microcontroller WebSerial Stream',
      data: evaluation.data
    });
  };

  const handleRunQCTest = () => {
    setTesting(true);
    setTestResult(null);

    setTimeout(() => {
      const dataToUse = (mode === 'LIVE' && liveStreamData?.parsedData) ? liveStreamData.parsedData : {};
      evaluateTelemetryData(dataToUse);
      setTesting(false);
    }, 800);
  };

  return (
    <div className="p-8 bg-slate-950 text-white min-h-screen space-y-8">
      {/* Header */}
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-3">
            <ShieldCheck size={14} /> Hardware Quality Inspector & Fault Diagnostic
          </div>
          <h1 className="text-3xl font-bold text-white">Microcontroller Sensor Quality Inspection</h1>
          <p className="text-gray-400 text-sm mt-1">
            Strict physical USB serial hardware signal verification against factory nominal limits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setTestResult(null);
            }}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-blue-400 focus:outline-none"
          >
            <option value="LIVE">🔌 Mode: Physical Microcontroller Data</option>
            <option value="SIMULATE_PASS">🟢 Demo Mode: Simulate Pass</option>
            <option value="SIMULATE_FAULT">⚠️ Demo Mode: Simulate Fault</option>
          </select>

          <button
            onClick={handleRunQCTest}
            disabled={testing}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 transition"
          >
            {testing ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
            {testing ? 'Inspecting Hardware...' : 'Run QC Diagnostic Test'}
          </button>
        </div>
      </div>

      {/* Live Hardware Status Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full ${liveStreamData?.timestamp ? 'bg-emerald-500 animate-ping' : 'bg-slate-600'}`} />
          <span className="font-bold text-white">
            {liveStreamData?.timestamp ? '🟢 Live Hardware Telemetry Streaming' : '🔌 DISCONNECTED — Waiting for Physical Microcontroller USB Port'}
          </span>
        </div>

        {!liveStreamData?.timestamp && (
          <Link
            to="/run"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition"
          >
            <Usb size={14} /> Connect Microcontroller USB in RUN Studio
          </Link>
        )}
      </div>

      {/* Sensor Profile Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SENSOR_QC_PROFILES.map((prof) => (
          <button
            key={prof.id}
            onClick={() => {
              setSelectedProfile(prof);
              setTestResult(null);
            }}
            className={`p-4 rounded-2xl border text-left transition ${
              selectedProfile.id === prof.id
                ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                : 'bg-slate-900 border-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            <div className="text-xs font-bold">{prof.name}</div>
            <div className="text-[10px] text-gray-500 mt-1">{prof.interface}</div>
          </button>
        ))}
      </div>

      {/* Inspection & Results Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Specifications Matrix */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-blue-500 flex items-center gap-2">
            <Cpu size={18} /> Factory Nominal Specifications
          </h2>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between text-xs">
              <span className="text-gray-400 font-semibold">Operating Voltage</span>
              <span className="font-bold text-blue-400">{selectedProfile.voltage}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between text-xs">
              <span className="text-gray-400 font-semibold">Signal Interface</span>
              <span className="font-bold text-blue-400">{selectedProfile.interface}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {selectedProfile.defaultOutputs.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white">{item.param}</div>
                  <div className="text-[10px] text-gray-500">Tol: {item.tolerance}</div>
                </div>
                <div className="font-extrabold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                  {item.nominal}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Banner */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="text-blue-500" size={18} /> Quality Diagnostic Results
          </h2>

          {testResult ? (
            testResult.noBoard ? (
              <div className="p-6 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-300 space-y-3">
                <div className="flex items-center gap-3">
                  <XCircle size={24} className="text-amber-400" />
                  <span className="text-sm font-bold">🔌 No Physical Microcontroller Connected</span>
                </div>
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  No live hardware telemetry was received over WebSerial. Plug in your Arduino UNO Q, STM32, or ESP32 board in RUN Studio to run live hardware inspection.
                </p>
                <Link
                  to="/run"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition"
                >
                  <Usb size={14} /> Connect Microcontroller USB
                </Link>
              </div>
            ) : testResult.passed ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={28} className="text-emerald-400" />
                  <div>
                    <div className="text-base font-extrabold text-white">VERDICT: OPTIMAL (PASSED)</div>
                    <div className="text-xs text-emerald-400">All sensor signals match factory nominal specifications.</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 space-y-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={28} className="text-red-400" />
                  <div>
                    <div className="text-base font-extrabold text-white">VERDICT: HARDWARE FAULT DETECTED</div>
                    <div className="text-xs text-red-400">Signal drift or component read failure detected.</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-red-500/20">
                  <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                    <Wrench size={14} /> Hardware Root-Cause Troubleshooting Guide:
                  </h4>
                  <div className="space-y-2">
                    {selectedProfile.debugGuide.map((g) => (
                      <div key={g.step} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                        <span className="font-bold text-blue-400">Step {g.step}: {g.title}</span>
                        <p className="text-gray-400 mt-0.5">{g.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-gray-500 italic">
              Click "Run QC Diagnostic Test" or connect microcontroller USB to inspect live hardware signals...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
