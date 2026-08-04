import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, AlertTriangle, XCircle, CheckCircle2, RefreshCw,
  Zap, Wrench, Activity, Radio, Thermometer, Wind, Eye, Compass,
  Flame, Droplets, Cpu, ArrowRight, HelpCircle, Terminal, Usb
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { subscribeTelemetry, getLatestTelemetry } from '../services/telemetryService';

const SENSOR_QC_PROFILES = [
  {
    id: 'dht11',
    name: 'DHT11 Temp & Humidity',
    paramKeys: ['TEMP', 'HUMIDITY', 'TEMPERATURE'],
    voltage: '3.3V - 5V DC',
    interface: 'Digital Single-Wire',
    defaultOutputs: [
      { param: 'Temperature', nominal: '20°C - 30°C', tolerance: '±2°C' },
      { param: 'Humidity', nominal: '30% - 75% RH', tolerance: '±5%' },
      { param: 'Read Interval', nominal: '≥ 2.0 seconds', tolerance: 'Min delay' },
    ],
    evaluate: (data) => {
      const temp = parseFloat(data.TEMP || data.TEMPERATURE);
      const hum = parseFloat(data.HUMIDITY);
      if (isNaN(temp) && isNaN(hum)) return null;
      const isPassed = temp >= 15 && temp <= 40 && hum >= 20 && hum <= 85;
      return {
        status: isPassed ? 'OPTIMAL' : 'FAULT',
        passed: isPassed,
        data: { temp: `${temp}°C`, humidity: `${hum}%`, status: isPassed ? 'OPTIMAL' : 'TEMPERATURE/HUMIDITY DEVIATION' }
      };
    },
    debugGuide: [
      { step: 1, title: 'Verify Pull-Up Resistor', desc: 'DHT11 data line requires a 10kΩ pull-up resistor connected between VCC and Data pin (D2).' },
      { step: 2, title: 'Check Power Stability', desc: 'Ensure stable 5V DC supply. Low voltage (<4.5V) causes nan temperature read failures.' },
      { step: 3, title: 'Sampling Rate Limitation', desc: 'Do not read DHT11 faster than once every 2 seconds. Rapid reading overheats internal sensor element.' },
      { step: 4, title: 'Signal Wire Length', desc: 'Keep jumper wires under 20cm. Long wires add capacitance causing checksum errors.' },
    ],
  },

  {
    id: 'hc-sr04',
    name: 'HC-SR04 Ultrasonic Distance',
    paramKeys: ['DISTANCE', 'DIST'],
    voltage: '5V DC (Strict)',
    interface: 'Digital Pulse (Trig/Echo)',
    defaultOutputs: [
      { param: 'Blind Zone', nominal: '< 2 cm', tolerance: 'Minimum distance' },
      { param: 'Max Range', nominal: '400 cm', tolerance: '±3 mm' },
      { param: 'Echo Pulse', nominal: '100µs - 25000µs', tolerance: 'PulseIn timing' },
    ],
    evaluate: (data) => {
      const distStr = data.DISTANCE || data.DIST;
      if (!distStr) return null;
      const dist = parseFloat(distStr.replace(/[^0-9.]/g, ''));
      if (isNaN(dist)) return null;
      const isPassed = dist >= 2.0 && dist <= 400.0;
      return {
        status: isPassed ? 'OPTIMAL' : 'FAULT',
        passed: isPassed,
        data: { distance: `${dist} cm`, status: isPassed ? 'OPTIMAL' : 'DISTANCE OUT OF BOUNDS / BLIND ZONE' }
      };
    },
    debugGuide: [
      { step: 1, title: '5V Supply Requirement', desc: 'HC-SR04 WILL NOT WORK reliably on 3.3V. Connect VCC strictly to Arduino 5V pin.' },
      { step: 2, title: 'Target Surface Alignment', desc: 'Ensure target surface is hard, flat, and perpendicular. Soft clothes absorb ultrasound.' },
      { step: 3, title: 'Check Trig/Echo Pins', desc: 'Trig must be digital OUTPUT, Echo must be digital INPUT. Swapping them prevents pulse generation.' },
      { step: 4, title: 'Timeout Configuration', desc: 'Use pulseIn(ECHO_PIN, HIGH, 30000) with a 30ms timeout to prevent code blocking.' },
    ],
  },

  {
    id: 'mq-2',
    name: 'MQ-2 Gas & Smoke Sensor',
    paramKeys: ['GAS', 'GAS_ADC', 'SMOKE'],
    voltage: '5V DC (150mA Heater)',
    interface: 'Analog AOUT + Digital DOUT',
    defaultOutputs: [
      { param: 'Clean Air Baseline', nominal: '100 - 300 ADC', tolerance: 'Zero point' },
      { param: 'Heater Current', nominal: '150 mA @ 5V', tolerance: 'Heater active' },
      { param: 'Digital Threshold', nominal: 'HIGH (Clean Air)', tolerance: 'LOW on gas' },
    ],
    evaluate: (data) => {
      const gasVal = data.GAS || data.GAS_ADC;
      if (!gasVal) return null;
      const gas = parseFloat(gasVal);
      if (isNaN(gas)) return null;
      const isPassed = gas >= 40 && gas <= 350;
      return {
        status: isPassed ? 'OPTIMAL' : 'FAULT',
        passed: isPassed,
        data: { gasADC: gas, alert: isPassed ? 'CLEAN AIR BASELINE' : 'ELEVATED GAS CONCENTRATION', status: isPassed ? 'OPTIMAL' : 'THRESHOLD EXCEEDED' }
      };
    },
    debugGuide: [
      { step: 1, title: 'Burn-In Preheating Time', desc: 'MQ-2 heater requires 3-5 minutes preheating before baseline readings stabilize.' },
      { step: 2, title: 'Calibrate Blue Trimmer Potentiometer', desc: 'Turn blue potentiometer counter-clockwise until DOUT LED turns OFF in clean air.' },
      { step: 3, title: 'Heater Current Supply', desc: 'Internal heater draws 150mA. Ensure adequate USB/external power.' },
      { step: 4, title: 'ADC Baseline Offset', desc: 'Subtract clean-air baseline ADC value in code: netADC = rawADC - baselineADC.' },
    ],
  },
];

export default function SensorQualityChecker() {
  const [selectedProfile, setSelectedProfile] = useState(SENSOR_QC_PROFILES[0]);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [mode, setMode] = useState('LIVE'); // 'LIVE', 'SIMULATE_PASS', 'SIMULATE_FAULT'
  const [liveStreamData, setLiveStreamData] = useState(getLatestTelemetry());

  useEffect(() => {
    const unsubscribe = subscribeTelemetry((latest) => {
      setLiveStreamData(latest);
      if (mode === 'LIVE' && latest.parsedData && Object.keys(latest.parsedData).length > 0) {
        evaluateTelemetryData(latest.parsedData);
      }
    });
    return () => unsubscribe();
  }, [mode, selectedProfile]);

  const evaluateTelemetryData = (dataToEvaluate) => {
    if (mode === 'SIMULATE_FAULT') {
      setTestResult({
        timestamp: new Date().toLocaleTimeString(),
        status: 'FAULT',
        passed: false,
        source: 'Simulated Hardware Fault (Test Mode)',
        noBoard: false,
        data: { value: '0.0 (OUT OF BOUNDS)', status: 'FAILED NOMINAL CHECK' }
      });
      return;
    }

    if (mode === 'SIMULATE_PASS') {
      setTestResult({
        timestamp: new Date().toLocaleTimeString(),
        status: 'OPTIMAL',
        passed: true,
        source: 'Simulated Pass Inspection (Test Mode)',
        noBoard: false,
        data: { nominal: 'MATCHES SPEC', status: 'OPTIMAL QUALITY' }
      });
      return;
    }

    // LIVE HARDWARE EVALUATION
    const evaluation = selectedProfile.evaluate(dataToEvaluate || {});
    if (!evaluation) {
      setTestResult({
        timestamp: new Date().toLocaleTimeString(),
        status: 'NO_HARDWARE',
        passed: false,
        noBoard: true,
        source: 'WebSerial Live Hardware Monitor',
        data: {}
      });
      return;
    }

    setTestResult({
      timestamp: new Date().toLocaleTimeString(),
      status: evaluation.status,
      passed: evaluation.passed,
      noBoard: false,
      source: 'WebSerial Live Hardware Stream',
      data: evaluation.data
    });
  };

  const handleRunQCTest = () => {
    setTesting(true);
    setTestResult(null);

    setTimeout(() => {
      const dataToUse = (mode === 'LIVE' && liveStreamData.parsedData) ? liveStreamData.parsedData : {};
      evaluateTelemetryData(dataToUse);
      setTesting(false);
    }, 1000);
  };

  return (
    <div className="p-8 bg-slate-950 text-white min-h-screen space-y-8">
      {/* Header */}
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-3">
            <ShieldCheck size={14} /> Hardware Quality Inspector & Fault Diagnostic
          </div>
          <h1 className="text-3xl font-bold text-white">Sensor Quality Inspection Session</h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time WebSerial hardware evaluation against factory nominal specifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Selector */}
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setTestResult(null);
            }}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-blue-400 focus:outline-none"
          >
            <option value="LIVE">🔌 Mode: Live WebSerial Board Data</option>
            <option value="SIMULATE_PASS">🟢 Demo Mode: Simulate Pass</option>
            <option value="SIMULATE_FAULT">⚠️ Demo Mode: Simulate Fault</option>
          </select>

          <button
            onClick={handleRunQCTest}
            disabled={testing}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 transition"
          >
            {testing ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
            {testing ? 'Inspecting Data...' : 'Run QC Diagnostic Test'}
          </button>
        </div>
      </div>

      {/* Live Stream Status Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full ${liveStreamData.timestamp ? 'bg-green-500 animate-ping' : 'bg-amber-500'}`} />
          <span className="font-bold text-white">
            {liveStreamData.timestamp ? 'Live WebSerial Data Flowing from RUN Studio' : 'WebSerial Hardware Disconnected'}
          </span>
        </div>

        {!liveStreamData.timestamp && (
          <Link
            to="/run"
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1.5 transition"
          >
            <Usb size={14} /> Connect Microcontroller in RUN Studio
          </Link>
        )}

        {liveStreamData.timestamp && (
          <div className="flex items-center gap-2 font-mono text-blue-400">
            {Object.entries(liveStreamData.parsedData).map(([k, v], i) => (
              <span key={i} className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                {k}: <strong>{v}</strong>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Sensor Profile Selector Tabs */}
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

      {/* Main Inspection Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Specifications Matrix */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-blue-500 flex items-center gap-2">
            <Cpu size={18} /> Factory Nominal Limits
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

        {/* Inspection Output Display */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="text-blue-500" size={18} /> QC Diagnostic Matrix
              </h2>
              {testResult && (
                <span className="text-xs text-gray-400">{testResult.source}</span>
              )}
            </div>

            {!testResult && !testing && (
              <div className="text-center py-16 space-y-3">
                <ShieldCheck className="mx-auto text-blue-500/40" size={54} />
                <h3 className="text-lg font-bold text-gray-300">Ready to Quality Check {selectedProfile.name}</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Click <strong>"Run QC Diagnostic Test"</strong> to evaluate connected hardware or demo modes.
                </p>
              </div>
            )}

            {testing && (
              <div className="text-center py-16 space-y-4">
                <RefreshCw className="mx-auto text-blue-500 animate-spin" size={48} />
                <div className="text-sm font-bold text-blue-400 animate-pulse">
                  Inspecting WebSerial telemetry & comparing with nominal limits...
                </div>
              </div>
            )}

            {/* NO HARDWARE CONNECTED BANNER */}
            {testResult && testResult.noBoard && (
              <div className="p-8 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-300 space-y-4 text-center">
                <Usb className="mx-auto text-amber-400" size={48} />
                <h3 className="text-xl font-bold text-white">No Physical Hardware Board Connected</h3>
                <p className="text-xs text-amber-200/80 max-w-md mx-auto leading-relaxed">
                  No live serial data was received from USB WebSerial. To inspect your physical sensor, connect your Arduino in <strong>RUN Studio</strong> or switch mode to <strong>"Demo Mode"</strong> to test simulated UI flows.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    to="/run"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition"
                  >
                    <Usb size={16} /> Open RUN Studio Hardware Monitor
                  </Link>
                  <button
                    onClick={() => {
                      setMode('SIMULATE_PASS');
                      evaluateTelemetryData({});
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:text-white text-gray-400 text-xs font-bold transition"
                  >
                    Enable Demo Mode
                  </button>
                </div>
              </div>
            )}

            {/* VALID OR FAULT RESULT */}
            {testResult && !testResult.noBoard && (
              <div className="space-y-6 pt-4">
                <div className={`p-6 rounded-2xl border flex items-center gap-4 ${
                  testResult.passed
                    ? 'bg-green-950/30 border-green-500/40 text-green-400'
                    : 'bg-red-950/30 border-red-500/40 text-red-400'
                }`}>
                  {testResult.passed ? (
                    <CheckCircle2 className="shrink-0 text-green-400" size={38} />
                  ) : (
                    <XCircle className="shrink-0 text-red-400" size={38} />
                  )}
                  <div>
                    <div className="text-lg font-extrabold">
                      {testResult.passed ? 'PASSED — Optimal Quality Sensor' : 'QUALITY FAULT DETECTED — Parameter Deviation'}
                    </div>
                    <div className="text-xs opacity-80 mt-1">
                      {testResult.passed
                        ? 'All measured parameters match factory nominal specifications.'
                        : 'Sensor output deviates from baseline limits. Review troubleshooting process below.'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Object.entries(testResult.data).map(([key, val], idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="text-xs font-bold text-gray-400 uppercase">{key}</div>
                      <div className={`text-xl font-black mt-1 ${testResult.passed ? 'text-green-400' : 'text-red-400'}`}>
                        {val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Debugging Process (Only on Fault) */}
          {testResult && !testResult.passed && !testResult.noBoard && (
            <div className="bg-slate-950 p-6 rounded-2xl border border-red-500/30 space-y-4">
              <h3 className="text-sm font-extrabold text-red-400 flex items-center gap-2">
                <Wrench size={16} /> Hardware Debugging Process
              </h3>
              <div className="space-y-3">
                {selectedProfile.debugGuide.map((guide) => (
                  <div key={guide.step} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-extrabold flex items-center justify-center shrink-0">
                      {guide.step}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">{guide.title}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{guide.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
