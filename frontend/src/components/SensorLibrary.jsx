import React, { useState } from 'react';
import {
  Search, Cpu, ArrowLeft, ChevronRight, Check, Copy, Download,
  Radio, Thermometer, Wind, Activity, Eye, Compass, Gauge,
  Sprout, Sun, Volume2, ShieldCheck, Flame, Zap, Wifi, Droplets,
  Award, Lightbulb, BookOpen, Layers
} from 'lucide-react';

const SENSORS = [
  {
    id: 'hc-sr04',
    name: 'HC-SR04',
    fullName: 'HC-SR04 Ultrasonic Distance Sensor',
    category: 'Distance',
    tagline: 'Non-contact distance measurement from 2cm to 400cm using sonar pulses',
    color: 'blue',
    voltage: '5V DC',
    current: '15 mA',
    range: '2 cm – 400 cm (1 inch – 13 feet)',
    accuracy: '3 mm (0.3 cm resolution)',
    interface: 'Digital Pulse (Trig / Echo)',
    operatingFreq: '40 kHz ultrasonic frequency',
    icon: Radio,
    workingPrinciple: `The HC-SR04 measures distance using acoustic sonar waves:

1. Arduino sends a HIGH pulse for 10 microseconds to the TRIG pin.
2. The sensor automatically transmits eight 40 kHz ultrasonic sound bursts.
3. The sound waves travel through the air, strike an object, and bounce back.
4. The ECHO pin goes HIGH for the exact duration it took the sound wave to return.
5. Arduino measures this pulse duration using pulseIn(ECHO_PIN, HIGH).

Distance Formula:
  Distance (cm) = (Duration in µs × 0.0343) / 2
  (Divided by 2 because the wave travels to the object and back)`,
    pins: [
      { label: 'VCC', color: '#ef4444', desc: 'Power Supply — 5V DC' },
      { label: 'Trig', color: '#3b82f6', desc: 'Trigger Input — 10µs HIGH pulse to start measurement' },
      { label: 'Echo', color: '#60a5fa', desc: 'Echo Output — HIGH pulse duration = time of flight' },
      { label: 'GND', color: '#475569', desc: 'Ground' },
    ],
    applications: [
      'Autonomous obstacle avoidance robots',
      'Parking assistance sensors and garage distance indicators',
      'Water tank liquid level monitoring',
      'Touchless interactive displays & liquid soap dispensers',
      'Security intruder detection barriers',
    ],
    code: `#define TRIG_PIN 9
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
  float distanceCm = (duration * 0.0343) / 2.0;

  Serial.print("TELEMETRY|DISTANCE:");
  Serial.print(distanceCm, 1);
  Serial.println("CM");

  delay(200);
}`,
    library: 'Built-in (pulseIn) or NewPing library',
    tips: [
      'Avoid measuring soft textiles or acoustic-absorbing materials',
      'Keep surface perpendicular to the sensor beam for maximum range',
      'Do not place sensors closer than 2 cm to objects (blind zone)',
    ],
  },

  {
    id: 'dht11',
    name: 'DHT11',
    fullName: 'DHT11 Temperature & Humidity Sensor',
    category: 'Temperature',
    tagline: 'Basic, low-cost digital temperature and relative humidity sensor',
    color: 'cyan',
    voltage: '3.3V – 5V DC',
    current: '2.5 mA max (during measurement)',
    range: 'Temp: 0–50°C | Humidity: 20–90% RH',
    accuracy: 'Temp: ±2°C | Humidity: ±5% RH',
    interface: 'Single-Wire Custom Digital Bus',
    operatingFreq: 'Sampling rate: 1 Hz (1 reading / sec)',
    icon: Thermometer,
    workingPrinciple: `The DHT11 contains a capacitive humidity sensing element and a thermistor:

1. Capacitive Humidity Element: Uses a moisture-holding substrate between two electrodes. As humidity changes, conductivity changes.
2. NTC Thermistor: Measures temperature via negative temperature coefficient resistance.
3. Onboard 8-bit IC: Converts analog signals to a 40-bit digital data stream (5 bytes: Humidity Integer, Humidity Decimal, Temp Integer, Temp Decimal, Checksum).`,
    pins: [
      { label: 'VCC', color: '#ef4444', desc: 'Power Supply — 3.3V to 5V DC' },
      { label: 'Data', color: '#3b82f6', desc: 'Digital Data Output — requires 10kΩ pull-up to VCC' },
      { label: 'NC', color: '#475569', desc: 'Not Connected' },
      { label: 'GND', color: '#475569', desc: 'Ground' },
    ],
    applications: [
      'Smart home climate automation (HVAC control)',
      'Greenhouse environmental monitoring',
      'Weather stations',
      'Server room humidity & thermal alerts',
    ],
    code: `#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
}

void loop() {
  delay(2000);
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("DHT11 read failed!");
    return;
  }

  Serial.print("TELEMETRY|TEMP:");
  Serial.print(t, 1);
  Serial.print("C|HUMIDITY:");
  Serial.print(h, 1);
  Serial.println("%");
}`,
    library: 'Adafruit DHT Sensor Library',
    tips: [
      'Add a 10kΩ pull-up resistor between VCC and Data pin',
      'Do not sample faster than once every 1–2 seconds',
    ],
  },

  {
    id: 'mq-2',
    name: 'MQ-2 Gas',
    fullName: 'MQ-2 LPG, Smoke & Combustible Gas Sensor',
    category: 'Gas & Air',
    tagline: 'High sensitivity to LPG, propane, methane, alcohol, hydrogen & smoke',
    color: 'purple',
    voltage: '5V DC (heater requires 5V)',
    current: '150 mA (heater ON)',
    range: '200 – 10,000 ppm',
    accuracy: 'Analog threshold ratio (Rs/Ro)',
    interface: 'Analog Output (AOUT) + Digital Output (DOUT)',
    operatingFreq: 'Continuous sampling',
    icon: Wind,
    workingPrinciple: `The MQ-2 uses a SnO₂ (Tin Dioxide) sensitive layer:

1. SnO₂ has lower electrical conductivity in clean air.
2. In the presence of combustible gases, SnO₂ surface oxygen reacts with the gas, releasing electrons.
3. This decreases sensor resistance, raising output analog voltage on AOUT pin.
4. DOUT switches LOW via LM393 comparator when gas concentration exceeds potentiometer threshold.`,
    pins: [
      { label: 'VCC', color: '#ef4444', desc: 'Power Supply — 5V DC (Heater requirement)' },
      { label: 'GND', color: '#475569', desc: 'Ground' },
      { label: 'DOUT', color: '#3b82f6', desc: 'Digital Output — LOW when gas exceeds threshold' },
      { label: 'AOUT', color: '#60a5fa', desc: 'Analog Output — 0V to 5V proportional to gas level' },
    ],
    applications: [
      'Gas leak detection alarms (LPG, propane)',
      'Home fire and smoke alarm systems',
      'Industrial air quality safety monitoring',
    ],
    code: `#define MQ2_ANALOG A0
#define MQ2_DIGITAL 8

void setup() {
  Serial.begin(115200);
  pinMode(MQ2_DIGITAL, INPUT);
}

void loop() {
  int rawADC = analogRead(MQ2_ANALOG);
  int gasState = digitalRead(MQ2_DIGITAL);

  Serial.print("TELEMETRY|GAS_ADC:");
  Serial.print(rawADC);
  Serial.print("|ALERT:");
  Serial.println(gasState == LOW ? "DETECTED" : "NORMAL");

  delay(500);
}`,
    library: 'Built-in analogRead / MQUnifiedsensor',
    tips: [
      'Burn-in time: Allow sensor to heat up for 24-48 hours initially',
      'The module gets warm during normal operation due to internal heater',
    ],
  },

  {
    id: 'pir-hc-sr501',
    name: 'PIR Motion',
    fullName: 'HC-SR501 Passive Infrared (PIR) Motion Sensor',
    category: 'Motion',
    tagline: 'Detects human & animal body motion via infrared radiation',
    color: 'rose',
    voltage: '4.5V – 20V DC',
    current: '50 µA standby',
    range: 'Up to 7 meters (120° cone angle)',
    accuracy: 'Digital HIGH/LOW state output',
    interface: 'Digital Output (3.3V TTL)',
    operatingFreq: 'Adjustable delay (0.3s – 5 minutes)',
    icon: Activity,
    workingPrinciple: `PIR sensors detect infrared radiation emitted by warm bodies:

1. Uses a dual pyroelectric sensor behind a Fresnel lens.
2. When a warm body passes, the IR level on one half of the sensor changes relative to the other.
3. The onboard BISS0001 IC calculates the differential change and pulls the output pin HIGH (3.3V).`,
    pins: [
      { label: 'VCC', color: '#ef4444', desc: 'Power Supply — 4.5V to 20V DC' },
      { label: 'OUT', color: '#3b82f6', desc: 'Digital Output — 3.3V HIGH on motion detection' },
      { label: 'GND', color: '#475569', desc: 'Ground' },
    ],
    applications: [
      'Automatic security lights & motion alarms',
      'Occupancy sensors for smart home energy saving',
    ],
    code: `#define PIR_PIN 3

void setup() {
  Serial.begin(115200);
  pinMode(PIR_PIN, INPUT);
}

void loop() {
  int motion = digitalRead(PIR_PIN);
  if (motion == HIGH) {
    Serial.println("TELEMETRY|MOTION:DETECTED");
  } else {
    Serial.println("TELEMETRY|MOTION:IDLE");
  }
  delay(500);
}`,
    library: 'Built-in digitalRead',
    tips: [
      'Adjust sensitivity and delay time using the two orange potentiometers on board',
    ],
  },

  {
    id: 'mpu-6050',
    name: 'MPU-6050',
    fullName: 'MPU-6050 6-Axis Motion Tracking Sensor (Gyro + Accel)',
    category: 'Motion / IMU',
    tagline: 'Precision 3-axis gyroscope and 3-axis accelerometer with DMP',
    color: 'teal',
    voltage: '3.3V – 5V DC',
    current: '3.9 mA active',
    range: 'Gyro: ±250–2000°/s | Accel: ±2g–16g',
    accuracy: '16-bit ADC per channel',
    interface: 'I²C (Address 0x68 / 0x69)',
    operatingFreq: 'Up to 1000 Hz data rate',
    icon: Compass,
    workingPrinciple: `Combines MEMS accelerometers and gyroscopes:

1. Accelerometers measure static gravitational tilt and dynamic acceleration.
2. Gyroscopes measure angular velocity via Coriolis acceleration.
3. Digital Motion Processor (DMP) merges both signals to calculate roll, pitch, and yaw.`,
    pins: [
      { label: 'VCC', color: '#ef4444', desc: 'Power Supply — 3.3V to 5V DC' },
      { label: 'GND', color: '#475569', desc: 'Ground' },
      { label: 'SCL', color: '#3b82f6', desc: 'I²C Clock -> Arduino A5 / SCL' },
      { label: 'SDA', color: '#60a5fa', desc: 'I²C Data -> Arduino A4 / SDA' },
    ],
    applications: [
      'Self-balancing robots and drones',
      'Game controllers & VR motion trackers',
    ],
    code: `#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;

void setup() {
  Serial.begin(115200);
  Wire.begin();
  mpu.initialize();
}

void loop() {
  int16_t ax, ay, az, gx, gy, gz;
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  Serial.print("TELEMETRY|AX:");
  Serial.print(ax / 16384.0);
  Serial.print("|AY:");
  Serial.print(ay / 16384.0);
  Serial.print("|AZ:");
  Serial.println(az / 16384.0);

  delay(100);
}`,
    library: 'MPU6050 (Electronic Cats) or Adafruit MPU6050',
    tips: ['Keep AD0 pin connected to GND for default 0x68 I²C address'],
  },

  {
    id: 'max30100',
    name: 'MAX30100',
    fullName: 'MAX30100 Pulse Oximeter & Heart Rate Sensor',
    category: 'Health',
    tagline: 'Non-invasive blood oxygen (SpO₂) & heart rate monitoring',
    color: 'red',
    voltage: '1.8V – 3.3V DC',
    current: '600 µA active',
    range: 'SpO₂: 0–100% | HR: 0–250 BPM',
    accuracy: 'SpO₂ ±2%, HR ±1 BPM',
    interface: 'I²C (0x57)',
    operatingFreq: 'LED: 880nm IR + 660nm Red',
    icon: Radio,
    workingPrinciple: `Uses photoplethysmography (PPG):

Red and IR light are passed through skin capillaries. Oxygenated blood absorbs more IR light, while deoxygenated blood absorbs more Red light. Photodetector reads absorption ratio to calculate SpO₂ and pulse rate.`,
    pins: [
      { label: 'VCC', color: '#ef4444', desc: 'Power Supply — 3.3V DC (DO NOT USE 5V)' },
      { label: 'GND', color: '#475569', desc: 'Ground' },
      { label: 'SCL', color: '#3b82f6', desc: 'I²C Clock -> Arduino A5 / SCL' },
      { label: 'SDA', color: '#60a5fa', desc: 'I²C Data -> Arduino A4 / SDA' },
    ],
    applications: ['Wearable health monitors', 'Pulse oximeters', 'Fitness bands'],
    code: `#include <Wire.h>
#include "MAX30100_PulseOximeter.h"

PulseOximeter pox;

void setup() {
  Serial.begin(115200);
  if (!pox.begin()) {
    Serial.println("MAX30100 init failed!");
    while (1);
  }
}

void loop() {
  pox.update();
  Serial.print("TELEMETRY|SPO2:");
  Serial.print(pox.getSpO2());
  Serial.print("%|HR:");
  Serial.print(pox.getHeartRate());
  Serial.println("BPM");
  delay(1000);
}`,
    library: 'MAX30100lib (OXullo)',
    tips: ['Press finger lightly — excessive pressure blocks blood flow'],
  },

  {
    id: 'ds18b20',
    name: 'DS18B20',
    fullName: 'DS18B20 Waterproof Temperature Sensor Probe',
    category: 'Temperature',
    tagline: 'Waterproof 1-Wire digital temperature probe',
    color: 'blue',
    voltage: '3.0V – 5.5V DC',
    current: '1 mA active',
    range: '-55°C to +125°C',
    accuracy: '±0.5°C (-10°C to +85°C)',
    interface: '1-Wire (Single Data Pin)',
    operatingFreq: '9-12 bit resolution',
    icon: Thermometer,
    workingPrinciple: `Uses silicon bandgap temperature sensing and 1-Wire bus protocol. Multiple sensors can share one data wire, identified by unique 64-bit ROM codes.`,
    pins: [
      { label: 'Red', color: '#ef4444', desc: 'VCC (3.0V - 5.5V)' },
      { label: 'Black', color: '#475569', desc: 'GND' },
      { label: 'Yellow', color: '#3b82f6', desc: 'Data (Requires 4.7kΩ pull-up resistor to VCC)' },
    ],
    applications: ['Aquarium temp control', 'Liquid temp monitoring', 'Soil temp probe'],
    code: `#include <OneWire.h>
#include <DallasTemperature.h>

OneWire oneWire(2);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(115200);
  sensors.begin();
}

void loop() {
  sensors.requestTemperatures();
  float temp = sensors.getTempCByIndex(0);
  Serial.print("TELEMETRY|DS18B20_TEMP:");
  Serial.print(temp, 2);
  Serial.println("C");
  delay(1000);
}`,
    library: 'OneWire + DallasTemperature',
    tips: ['Mandatory 4.7kΩ pull-up resistor between Yellow Data wire and Red VCC'],
  },

  {
    id: 'gps-neo6m',
    name: 'GPS NEO-6M',
    fullName: 'GY-NEO6MV2 GPS Positioning Module',
    category: 'Navigation',
    tagline: 'Satellite positioning module with NMEA serial output',
    color: 'emerald',
    voltage: '3.3V – 5V DC',
    current: '45 mA',
    range: '2.5m CEP position accuracy',
    accuracy: 'Position: ±2.5m',
    interface: 'UART Serial (9600 Baud)',
    operatingFreq: 'L1 1575.42 MHz',
    icon: Radio,
    workingPrinciple: `Receives positioning signals from visible GPS satellites, computes time-of-flight distances, and outputs NMEA 0183 standard sentences containing latitude, longitude, altitude, and speed.`,
    pins: [
      { label: 'VCC', color: '#ef4444', desc: 'Power Supply — 3.3V to 5V' },
      { label: 'GND', color: '#475569', desc: 'Ground' },
      { label: 'TX', color: '#3b82f6', desc: 'UART Transmit -> Arduino RX (Pin 4)' },
      { label: 'RX', color: '#60a5fa', desc: 'UART Receive -> Arduino TX (Pin 3)' },
    ],
    applications: ['Vehicle tracking', 'Drone waypoint navigation', 'Geofencing'],
    code: `#include <SoftwareSerial.h>
#include <TinyGPS++.h>

SoftwareSerial gpsSerial(4, 3);
TinyGPSPlus gps;

void setup() {
  Serial.begin(115200);
  gpsSerial.begin(9600);
}

void loop() {
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
    if (gps.location.isUpdated()) {
      Serial.print("TELEMETRY|LAT:");
      Serial.print(gps.location.lat(), 6);
      Serial.print("|LNG:");
      Serial.println(gps.location.lng(), 6);
    }
  }
}`,
    library: 'TinyGPS++',
    tips: ['Position antenna outdoors with direct sky view for initial satellite fix'],
  },
];

const CATEGORY_COLORS = {
  'Distance': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'Temperature': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  'Gas & Air': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  'Motion': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  'Motion / IMU': 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  'Health': 'bg-red-500/10 text-red-400 border-red-500/30',
  'Navigation': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
};

const ALL_CATEGORIES = ['All', ...new Set(SENSORS.map(s => s.category))];

export default function SensorLibrary() {
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copied, setCopied] = useState(false);

  const filteredSensors = SENSORS.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (selectedSensor) {
    const Icon = selectedSensor.icon;
    return (
      <div className="p-8 space-y-6 bg-slate-950 text-white min-h-screen">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedSensor(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 hover:text-white transition font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sensor List
          </button>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-500">
              <Icon size={40} />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                {selectedSensor.category}
              </span>
              <h1 className="text-3xl font-extrabold text-white mt-2">{selectedSensor.fullName}</h1>
              <p className="text-gray-400 text-sm mt-1">{selectedSensor.tagline}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-gray-400 uppercase font-bold">Operating Voltage</div>
              <div className="text-sm font-extrabold text-blue-400 mt-1">{selectedSensor.voltage}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-gray-400 uppercase font-bold">Current Consumption</div>
              <div className="text-sm font-extrabold text-blue-400 mt-1">{selectedSensor.current}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-gray-400 uppercase font-bold">Effective Range</div>
              <div className="text-sm font-extrabold text-blue-400 mt-1">{selectedSensor.range}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-gray-400 uppercase font-bold">Communication</div>
              <div className="text-sm font-extrabold text-blue-400 mt-1">{selectedSensor.interface}</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-blue-500 flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Working Principle
            </h2>
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-300 leading-relaxed bg-slate-950 p-5 rounded-2xl border border-slate-800">
              {selectedSensor.workingPrinciple}
            </pre>

            <h3 className="text-lg font-bold text-white mt-6">Pin Diagram & Wiring</h3>
            <div className="space-y-2">
              {selectedSensor.pins.map((pin, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="font-bold text-blue-400">{pin.label}</span>
                  <span className="text-gray-400">{pin.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-blue-500">Arduino C++ Code</h2>
              <button
                onClick={() => handleCopyCode(selectedSensor.code)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Code'}
              </button>
            </div>
            <pre className="font-mono text-xs text-green-400 bg-slate-950 p-5 rounded-2xl border border-slate-800 overflow-x-auto max-h-96">
              {selectedSensor.code}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-950 text-white min-h-screen space-y-8">
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-blue-500">Sensor Lab</h1>
          <p className="text-gray-400 text-sm mt-2">Comprehensive pinouts, working principles, applications, and working Arduino code.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sensor..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {filteredSensors.map((sensor) => {
          const Icon = sensor.icon;
          return (
            <div
              key={sensor.id}
              onClick={() => setSelectedSensor(sensor)}
              className="bg-slate-900 rounded-3xl p-6 border border-slate-800 hover:border-blue-500 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
                    <Icon size={28} />
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[sensor.category] || 'bg-blue-500/10 text-blue-400 border-blue-500/30'}`}>
                    {sensor.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{sensor.name}</h2>
                <p className="text-gray-400 text-xs mt-2 line-clamp-2">{sensor.tagline}</p>
              </div>
              <button className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2">
                Explore Sensor <ChevronRight size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
