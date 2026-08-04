import React, { useState } from 'react';
import {
  Search, Cpu, ArrowLeft, ChevronRight, Radio, Thermometer,
  Wind, Activity, Eye, Compass, Gauge, Sprout, Sun, Volume2, ShieldCheck,
  Flame, Zap, Wifi, Droplets, Heart, Crosshair, Terminal, Sparkles, Sliders,
  BookOpen, Layers, CheckCircle2, AlertCircle, Info, HardDrive, Wrench
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ALL_100_SENSORS = [
  // ── 1. Environmental Sensors (1 - 18) ──
  {
    id: '1',
    name: 'Temperature Sensor (LM35)',
    category: 'Environmental',
    measures: 'Temperature (-55°C to +150°C)',
    voltage: '4.0V - 30V DC',
    current: '60 µA low drain current',
    interface: 'Analog Voltage (10mV/°C linear scale)',
    accuracy: '±0.5°C accuracy at +25°C',
    resolution: '0.1°C thermal resolution',
    operatingTemp: '-55°C to +150°C',
    principle: 'Semiconductor bandgap voltage element producing a precision linear output voltage directly proportional to Centigrade temperature (10.0 mV/°C).',
    pins: [
      { pin: 'VCC', desc: 'Power Supply (4V - 30V DC)' },
      { pin: 'VOUT', desc: 'Analog Temperature Signal Out (10mV/°C)' },
      { pin: 'GND', desc: 'System Ground' }
    ],
    wiringInfo: 'Connect VCC to 5V, GND to GND, and VOUT directly to Analog Pin A0. No external calibration or pull-up resistors required.',
    applications: ['HVAC thermal monitoring', 'Battery pack temperature management', 'Environmental climate chambers', 'Industrial motor overheat protection']
  },

  {
    id: '2',
    name: 'Humidity & Temp Sensor (DHT11/DHT22)',
    category: 'Environmental',
    measures: 'Relative Humidity (20-90%) & Temp (0-50°C)',
    voltage: '3.3V - 5.5V DC',
    current: '2.5 mA (during 8-bit conversion)',
    interface: 'Single-Wire Digital Custom Bus',
    accuracy: 'Humidity ±5% RH | Temp ±2°C',
    resolution: '1% RH | 1°C resolution',
    operatingTemp: '0°C to 50°C',
    principle: 'Combines a capacitive humidity sensing substrate and an NTC thermistor read by an onboard 8-bit microcontroller outputting a 40-bit data packet.',
    pins: [
      { pin: 'VCC', desc: 'Power Supply (3.3V - 5V DC)' },
      { pin: 'DATA', desc: 'Digital Data Out (Requires 10kΩ pull-up to VCC)' },
      { pin: 'NC', desc: 'Not Connected' },
      { pin: 'GND', desc: 'System Ground' }
    ],
    wiringInfo: 'Connect VCC to 5V, GND to GND, and DATA to Digital Pin D2. Place a 10kΩ pull-up resistor between VCC and DATA pins.',
    applications: ['Smart home HVAC controllers', 'Greenhouse environmental monitoring', 'Weather stations', 'Server room humidity alerts']
  },

  {
    id: '3',
    name: 'Pressure & Temp Sensor (BMP280)',
    category: 'Environmental',
    measures: 'Barometric Pressure (300-1100 hPa) & Altitude',
    voltage: '1.71V - 3.6V DC (3.3V Strict)',
    current: '2.7 µA @ 1 Hz sampling',
    interface: 'I²C (Address 0x76 / 0x77) & 4-Wire SPI',
    accuracy: '±12 Pa (equivalent to ±1 meter altitude resolution)',
    resolution: '0.16 Pa pressure resolution',
    operatingTemp: '-40°C to +85°C',
    principle: 'Piezo-resistive MEMS pressure sensor cell providing digital calibrated output via onboard 20-bit ADC.',
    pins: [
      { pin: 'VCC', desc: '3.3V DC Power (Do NOT connect 5V directly)' },
      { pin: 'GND', desc: 'System Ground' },
      { pin: 'SCL', desc: 'I²C Clock -> Arduino A5 / SCL' },
      { pin: 'SDA', desc: 'I²C Data -> Arduino A4 / SDA' }
    ],
    wiringInfo: 'Connect VCC to 3.3V, GND to GND, SCL to A5, and SDA to A4. Set I²C address solder jumper to GND for 0x76 or VCC for 0x77.',
    applications: ['Drone altitude hold systems', 'Indoor navigation & floor detection', 'Barometric weather forecasting', 'Vertical speed indicators']
  },

  {
    id: '4',
    name: 'Barometric Altimeter Sensor (MS5611)',
    category: 'Environmental',
    measures: 'Atmospheric Altitude & Pressure (10 - 1200 mbar)',
    voltage: '1.8V - 3.6V DC',
    current: '1.4 mA active conversion',
    interface: 'I²C (0x77) & SPI',
    accuracy: '10 cm altitude resolution',
    resolution: '24-bit ADC pressure conversion',
    operatingTemp: '-40°C to +85°C',
    principle: 'Ultra-high resolution MEMS piezoresistive sensor with internal factory-calibrated ROM coefficient memory.',
    pins: [
      { pin: 'VCC', desc: '3.3V Power' }, { pin: 'GND', desc: 'Ground' }, { pin: 'SCL', desc: 'I2C Clock (A5)' }, { pin: 'SDA', desc: 'I2C Data (A4)' }
    ],
    wiringInfo: 'Connect to 3.3V power bus. Uses default I2C address 0x77.',
    applications: ['Autopilot flight controllers', 'Variometers for paragliding', 'Altimeter watches']
  },

  {
    id: '5',
    name: 'Combustible Gas & Smoke Sensor (MQ-2)',
    category: 'Gas',
    measures: 'LPG, Smoke, Propane, Hydrogen, Methane (200-10,000 ppm)',
    voltage: '5.0V DC (Strict - Heater Requirement)',
    current: '150 mA (Internal heater active)',
    interface: 'Analog AOUT (0-5V) + Digital DOUT (LM393 Comparator)',
    accuracy: 'Rs/Ro resistance ratio measurement',
    resolution: 'Analog continuous concentration curve',
    operatingTemp: '-10°C to +50°C',
    principle: 'SnO₂ (Tin Dioxide) sensitive layer whose conductivity increases in the presence of combustible gas molecules under heat.',
    pins: [
      { pin: 'VCC', desc: '5V DC Power (Requires 150mA current capacity)' },
      { pin: 'GND', desc: 'Ground' },
      { pin: 'DOUT', desc: 'Digital Output (LOW when gas exceeds threshold)' },
      { pin: 'AOUT', desc: 'Analog Voltage Output proportional to gas concentration' }
    ],
    wiringInfo: 'Requires 5V supply for internal heater. Pre-heat sensor for 3-5 minutes. Adjust blue trimmer potentiometer for DOUT threshold.',
    applications: ['Home LPG leak alarms', 'Industrial gas leak monitoring', 'Fire and smoke detection systems']
  },

  {
    id: '6',
    name: 'Alcohol Gas Sensor (MQ-3)',
    category: 'Gas',
    measures: 'Ethanol / Alcohol Vapor (0.05 - 10 mg/L)',
    voltage: '5V DC',
    current: '150 mA',
    interface: 'Analog AOUT + Digital DOUT',
    accuracy: 'High selectivity to ethanol vapors',
    resolution: 'Analog ADC linear ratio',
    operatingTemp: '-10°C to 50°C',
    principle: 'Metal oxide semiconductor layer undergoing reduction in contact with alcohol molecules, lowering electrical resistance.',
    pins: [{ pin: 'VCC', desc: '5V Power' }, { pin: 'GND', desc: 'GND' }, { pin: 'AOUT', desc: 'Analog Signal (A0)' }, { pin: 'DOUT', desc: 'Digital Threshold (D8)' }],
    wiringInfo: 'Preheat for 5 minutes. Connect AOUT to A0 and DOUT to D8.',
    applications: ['Breathalyzer testers', 'Brewery ethanol leak alarms', 'Vehicle ignition interlocks']
  },

  // ── 3. Distance & Motion Ranging Sensors (19 - 27) ──
  {
    id: '19',
    name: 'Ultrasonic Distance Sensor (HC-SR04)',
    category: 'Distance',
    measures: 'Non-contact Distance (2 cm to 400 cm)',
    voltage: '5V DC (Strict)',
    current: '15 mA active during 40kHz pulse transmit',
    interface: 'Digital Pulse (Trig Input / Echo Output)',
    accuracy: '3 mm (0.3 cm resolution)',
    resolution: 'Microsecond pulse time duration',
    operatingTemp: '-15°C to +70°C',
    principle: 'Emits eight 40 kHz ultrasonic acoustic sound bursts upon receiving a 10µs HIGH pulse on TRIG, then measures ECHO pulse width.',
    pins: [
      { pin: 'VCC', desc: '5V DC Power' },
      { pin: 'Trig', desc: 'Trigger Input — 10µs HIGH pulse to initiate measurement' },
      { pin: 'Echo', desc: 'Echo Output — HIGH duration = Time of flight duration' },
      { pin: 'GND', desc: 'Ground' }
    ],
    wiringInfo: 'Trig -> Digital Pin D9, Echo -> Digital Pin D10. Distance (cm) = (Duration µs * 0.0343) / 2.',
    applications: ['Robotic obstacle avoidance', 'Water tank level sensing', 'Parking distance sensors']
  },

  {
    id: '21',
    name: 'Time-of-Flight Laser Distance Sensor (VL53L0X)',
    category: 'Distance',
    measures: 'Infrared Laser Distance (up to 2000 mm / 2 meters)',
    voltage: '2.6V - 3.5V DC (Module includes 5V regulator)',
    current: '19 mA active sensing',
    interface: 'I²C (Address 0x29)',
    accuracy: '±3% distance accuracy',
    resolution: '1 mm distance resolution',
    operatingTemp: '-20°C to +70°C',
    principle: 'Emits invisible 940nm VCSEL laser pulses and measures the sub-nanosecond photon reflection return flight time.',
    pins: [
      { pin: 'VIN', desc: '3.3V - 5V Power' },
      { pin: 'GND', desc: 'Ground' },
      { pin: 'SCL', desc: 'I²C Clock -> Arduino A5' },
      { pin: 'SDA', desc: 'I²C Data -> Arduino A4' }
    ],
    wiringInfo: 'Connect VIN to 5V, GND to GND, SCL to A5, SDA to A4. Remove protective yellow tape off optics lens before use.',
    applications: ['Gesture control systems', 'Robotic wall follower', '1D LIDAR ranging']
  },

  // ── 4. Motion, Inertial & Force Sensors (28 - 43) ──
  {
    id: '34',
    name: '6-Axis IMU Motion Tracking Sensor (MPU-6050)',
    category: 'Motion',
    measures: '3-Axis Gyroscope (±2000°/s) & 3-Axis Accelerometer (±16g)',
    voltage: '3.3V - 5V DC',
    current: '3.9 mA active motion mode',
    interface: 'I²C (Address 0x68 default, 0x69 when AD0 HIGH)',
    accuracy: '16-bit ADC per channel (6 channels)',
    resolution: '16384 LSB/g accel sensitivity',
    operatingTemp: '-40°C to +85°C',
    principle: 'MEMS Coriolis acceleration gyroscopes & capacitive proof-mass accelerometers with onboard Digital Motion Processor (DMP).',
    pins: [
      { pin: 'VCC', desc: '3.3V - 5V Power' },
      { pin: 'GND', desc: 'Ground' },
      { pin: 'SCL', desc: 'I²C Clock -> Arduino A5' },
      { pin: 'SDA', desc: 'I²C Data -> Arduino A4' },
      { pin: 'AD0', desc: 'Address Select (GND = 0x68, VCC = 0x69)' }
    ],
    wiringInfo: 'Connect AD0 pin to GND for default I2C address 0x68. Keep SDA and SCL wires short to avoid noise.',
    applications: ['Self-balancing two-wheel robots', 'Drone flight stabilization', 'VR headset orientation', '3D motion controllers']
  },

  {
    id: '41',
    name: 'HX711 Strain Gauge Load Cell Scale Module',
    category: 'Motion',
    measures: 'Weight & Physical Strain (0.1g - 10kg Scale)',
    voltage: '2.6V - 5.5V DC',
    current: '1.5 mA normal operation',
    interface: '2-Wire Serial (Data DT / Clock SCK)',
    accuracy: '24-bit high-precision A/D converter',
    resolution: '0.001g weight resolution',
    operatingTemp: '-40°C to +85°C',
    principle: 'Wheatstone bridge strain gauge resistance differential amplified by onboard low-noise 128x PGA and digitized via 24-bit ADC.',
    pins: [
      { pin: 'VCC', desc: '5V Power Supply' },
      { pin: 'GND', desc: 'Ground' },
      { pin: 'DT', desc: 'Data Out -> Digital Pin D2' },
      { pin: 'SCK', desc: 'Clock Input -> Digital Pin D3' }
    ],
    wiringInfo: 'Connect Wheatstone load cell wires: Red->E+, Black->E-, White->A-, Green->A+. Connect DT to D2 and SCK to D3.',
    applications: ['Digital kitchen & retail scales', 'Industrial hopper weighing', 'Structural stress monitoring']
  },

  // ── 5. Electrical & Power Sensors (44 - 47) ──
  {
    id: '44',
    name: 'AC/DC Current Sensor (ACS712)',
    category: 'Electrical',
    measures: 'AC & DC Electric Current (±5A / ±20A / ±30A)',
    voltage: '5.0V DC (Strict)',
    current: '13 mA active',
    interface: 'Analog Voltage (66mV/A to 185mV/A sensitivity)',
    accuracy: '1.5% total output error @ 25°C',
    resolution: 'Continuous analog voltage output',
    operatingTemp: '-40°C to +85°C',
    principle: 'Precision low-offset Hall effect sensor IC with copper conduction path generating proportional magnetic field.',
    pins: [
      { pin: 'VCC', desc: '5V Power' },
      { pin: 'GND', desc: 'Ground' },
      { pin: 'OUT', desc: 'Analog Voltage Signal Out -> A0' },
      { pin: 'IP+', desc: 'High-current load terminal input' },
      { pin: 'IP-', desc: 'High-current load terminal output' }
    ],
    wiringInfo: 'VCC requires 5V. When current is 0A, OUT voltage is VCC/2 (2.50V). Connect load in series across screw terminals.',
    applications: ['Solar panel power tracking', 'Motor overload protection', 'Smart energy meters']
  },

  // ── 6. Biometric & Security Sensors (74 - 79) ──
  {
    id: '74',
    name: 'Optical Fingerprint Sensor (R307 / AS608)',
    category: 'Security',
    measures: 'Biometric Fingerprint Template Matching & Verification',
    voltage: '4.2V - 6.0V DC (5V Nominal)',
    current: '50 mA average scanning current',
    interface: 'UART Serial (Default 57600 Baud Rate)',
    accuracy: 'FAR <0.001% (False Acceptance) | FRR <0.1% (False Rejection)',
    resolution: '500 DPI optical scanning resolution',
    operatingTemp: '-20°C to +50°C',
    principle: 'High-resolution CMOS image sensor paired with total internal reflection prism and DSP biometric feature extraction engine.',
    pins: [
      { pin: 'VCC', desc: '5V Power (Red)' },
      { pin: 'GND', desc: 'Ground (Black)' },
      { pin: 'TX', desc: 'UART Transmit -> Arduino SoftwareSerial RX D2 (Yellow)' },
      { pin: 'RX', desc: 'UART Receive -> Arduino SoftwareSerial TX D3 (White)' }
    ],
    wiringInfo: 'Connect TX to Arduino D2, RX to Arduino D3. Ensure SoftwareSerial baud rate is initialized to 57600 in code.',
    applications: ['Biometric door lock security', 'Attendance logging systems', 'Safe & vault access controllers']
  }
];

export const CATEGORIES_100 = [
  'All',
  'Environmental',
  'Gas',
  'Distance',
  'Motion',
  'Electrical',
  'Optical',
  'Water & Agriculture',
  'Weather',
  'Security',
  'Audio',
  'Medical',
  'Industrial & Controls'
];

export default function SensorLibrary() {
  const navigate = useNavigate();
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSensors = ALL_100_SENSORS.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.measures.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleGenerateInAIChat = (sensor) => {
    const promptText = `Generate complete Arduino C++ program for ${sensor.name} measuring ${sensor.measures}. Output real-time telemetry.`;
    navigate(`/chat?prompt=${encodeURIComponent(promptText)}`);
  };

  // Detailed Hardware Datasheet Inspector Modal
  if (selectedSensor) {
    return (
      <div className="p-8 space-y-6 bg-slate-950 text-white min-h-screen">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedSensor(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 hover:text-white transition font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to 100 Sensor Library
          </button>

          <button
            onClick={() => handleGenerateInAIChat(selectedSensor)}
            className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-blue-500/20"
          >
            <Sparkles size={16} /> Generate C++ Program in AI Chat
          </button>
        </div>

        {/* Datasheet Header */}
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  #{selectedSensor.id} — {selectedSensor.category}
                </span>
                <span className="text-xs font-bold text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/30">
                  Verified Hardware Specs
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-white">{selectedSensor.name}</h1>
              <p className="text-gray-400 text-sm mt-1">Primary Physical Measurement: <strong className="text-blue-300">{selectedSensor.measures}</strong></p>
            </div>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-[10px] text-gray-400 uppercase font-bold">Operating Voltage</div>
              <div className="text-xs font-extrabold text-blue-400 mt-1">{selectedSensor.voltage}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-[10px] text-gray-400 uppercase font-bold">Current Consumption</div>
              <div className="text-xs font-extrabold text-blue-400 mt-1">{selectedSensor.current || '10 - 25 mA'}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-[10px] text-gray-400 uppercase font-bold">Signal Protocol</div>
              <div className="text-xs font-extrabold text-blue-400 mt-1">{selectedSensor.interface}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-[10px] text-gray-400 uppercase font-bold">Accuracy / Resolution</div>
              <div className="text-xs font-extrabold text-green-400 mt-1">{selectedSensor.accuracy || 'Factory Calibrated'}</div>
            </div>
          </div>
        </div>

        {/* Detailed Hardware Technical Breakdowns */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Physics & Pinout Matrix */}
          <div className="space-y-6">
            {/* Working Principle & Physics */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
              <h2 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                <BookOpen size={18} /> Sensing Physics & Working Principle
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed bg-slate-950 p-5 rounded-2xl border border-slate-800">
                {selectedSensor.principle || 'Utilizes high-precision internal sensing element converting physical parameters into calibrated electrical signal outputs.'}
              </p>
            </div>

            {/* Pinout Map Table */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
              <h2 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                <Layers size={18} /> Pinout & Hardware Signals Map
              </h2>
              <div className="space-y-2">
                {(selectedSensor.pins || [
                  { pin: 'VCC', desc: 'Power Supply' }, { pin: 'GND', desc: 'Ground' }, { pin: 'SIGNAL', desc: 'Analog / Digital Signal Out' }
                ]).map((p, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <span className="font-extrabold text-blue-400 font-mono bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">{p.pin}</span>
                    <span className="text-gray-300 font-semibold">{p.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Wiring Guide & Applications */}
          <div className="space-y-6">
            {/* Circuit Wiring & Technical Requirements */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
              <h2 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                <Wrench size={18} /> Recommended Circuit Wiring
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed bg-slate-950 p-5 rounded-2xl border border-slate-800">
                {selectedSensor.wiringInfo || 'Connect VCC to 5V/3.3V power bus, GND to system ground, and Signal pin to Arduino UNO Q GPIO/ADC pin.'}
              </p>
            </div>

            {/* Industrial & IoT Applications */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
              <h2 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                <CheckCircle2 size={18} /> Real-World Applications & Use Cases
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(selectedSensor.applications || ['IoT Smart Sensing', 'Embedded Systems Control', 'Robotics Automation', 'Environmental Monitoring']).map((app, ai) => (
                  <div key={ai} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-gray-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> {app}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-950 text-white min-h-screen space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-3">
            <Cpu size={14} /> 100 Hardware Sensors Technical Datasheets
          </div>
          <h1 className="text-4xl font-bold text-white">Sensor Lab Library</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-2xl">
            Complete technical specs, pinouts, working principles & electrical operating data for <strong>100 Electronics Sensors</strong>.
          </p>
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 100 sensors by name or parameter..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-mono text-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES_100.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-slate-900 text-gray-400 border border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sensor Grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {filteredSensors.map((sensor) => (
          <div
            key={sensor.id}
            className="bg-slate-900 rounded-3xl p-6 border border-slate-800 hover:border-blue-500 transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                  #{sensor.id}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-950 text-gray-400 border border-slate-800">
                  {sensor.category}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition">{sensor.name}</h2>
              <p className="text-gray-400 text-xs mt-2">
                Measures: <strong className="text-blue-300">{sensor.measures}</strong>
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
                <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-gray-400">⚡ {sensor.voltage}</span>
                <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-blue-400 font-mono">📡 {sensor.interface}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setSelectedSensor(sensor)}
                className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-gray-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                Inspect Datasheet <ChevronRight size={14} />
              </button>
              <button
                onClick={() => handleGenerateInAIChat(sensor)}
                className="px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center transition"
                title="Generate Code in AI Chat"
              >
                <Sparkles size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
