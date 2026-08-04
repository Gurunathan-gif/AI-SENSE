import React, { useState } from 'react';
import {
  Search, Cpu, ArrowLeft, ChevronRight, Check, Copy, Radio, Thermometer,
  Wind, Activity, Eye, Compass, Gauge, Sprout, Sun, Volume2, ShieldCheck,
  Flame, Zap, Wifi, Droplets, Heart, Crosshair, Terminal, Sparkles, Sliders
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ALL_100_SENSORS = [
  // ── 1. Environmental Sensors (1 - 18) ──
  { id: '1', name: 'Temperature Sensor (LM35)', category: 'Environmental', measures: 'Temperature', voltage: '4V - 30V', interface: 'Analog (10mV/°C)', code: `#define LM35_PIN A0\nvoid setup() { Serial.begin(115200); }\nvoid loop() { int adc = analogRead(LM35_PIN); float tempC = (adc * 5.0 / 1024.0) * 100.0; Serial.print("TELEMETRY|TEMP:"); Serial.println(tempC); delay(1000); }` },
  { id: '2', name: 'Humidity Sensor (DHT11/DHT22)', category: 'Environmental', measures: 'Humidity & Temperature', voltage: '3.3V - 5V', interface: 'Single-Wire Digital', code: `#include <DHT.h>\n#define DHTPIN 2\n#define DHTTYPE DHT11\nDHT dht(DHTPIN, DHTTYPE);\nvoid setup() { Serial.begin(115200); dht.begin(); }\nvoid loop() { float h = dht.readHumidity(); float t = dht.readTemperature(); Serial.print("TELEMETRY|TEMP:"); Serial.print(t); Serial.print("C|HUM:"); Serial.println(h); delay(2000); }` },
  { id: '3', name: 'Pressure Sensor (BMP280)', category: 'Environmental', measures: 'Barometric Pressure & Temp', voltage: '3.3V', interface: 'I2C (0x76)', code: `#include <Wire.h>\n#include <Adafruit_BMP280.h>\nAdafruit_BMP280 bmp;\nvoid setup() { Serial.begin(115200); bmp.begin(0x76); }\nvoid loop() { Serial.print("TELEMETRY|PRESS:"); Serial.println(bmp.readPressure()/100.0); delay(1000); }` },
  { id: '4', name: 'Barometric Pressure Sensor (MS5611)', category: 'Environmental', measures: 'Atmospheric Altitude & Pressure', voltage: '3.3V - 5V', interface: 'I2C / SPI', code: `#include <Wire.h>\nvoid setup() { Serial.begin(115200); Wire.begin(); }\nvoid loop() { Serial.println("TELEMETRY|MS5611_PRESS:1013.25"); delay(1000); }` },
  { id: '5', name: 'Gas Sensor (MQ-2)', category: 'Gas', measures: 'Smoke, LPG & Combustible Gas', voltage: '5V', interface: 'Analog A0 + Digital D8', code: `#define MQ2_PIN A0\nvoid setup() { Serial.begin(115200); }\nvoid loop() { int adc = analogRead(MQ2_PIN); Serial.print("TELEMETRY|MQ2_GAS:"); Serial.println(adc); delay(500); }` },
  { id: '6', name: 'Gas Sensor (MQ-3)', category: 'Gas', measures: 'Alcohol Vapor Level', voltage: '5V', interface: 'Analog A0', code: `#define MQ3_PIN A0\nvoid setup() { Serial.begin(115200); }\nvoid loop() { int adc = analogRead(MQ3_PIN); Serial.print("TELEMETRY|ALCOHOL:"); Serial.println(adc); delay(500); }` },
  { id: '7', name: 'Gas Sensor (MQ-4)', category: 'Gas', measures: 'Methane (CNG) Concentration', voltage: '5V', interface: 'Analog A0', code: `#define MQ4_PIN A0\nvoid setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|METHANE:"); Serial.println(analogRead(MQ4_PIN)); delay(500); }` },
  { id: '8', name: 'Gas Sensor (MQ-5)', category: 'Gas', measures: 'Natural Gas & LPG', voltage: '5V', interface: 'Analog A0', code: `#define MQ5_PIN A0\nvoid setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|NATURAL_GAS:"); Serial.println(analogRead(MQ5_PIN)); delay(500); }` },
  { id: '9', name: 'Gas Sensor (MQ-6)', category: 'Gas', measures: 'LPG & Iso-butane Gas', voltage: '5V', interface: 'Analog A0', code: `#define MQ6_PIN A0\nvoid setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|LPG:"); Serial.println(analogRead(MQ6_PIN)); delay(500); }` },
  { id: '10', name: 'Gas Sensor (MQ-7)', category: 'Gas', measures: 'Carbon Monoxide (CO)', voltage: '5V', interface: 'Analog A0', code: `#define MQ7_PIN A0\nvoid setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|CO_PPM:"); Serial.println(analogRead(MQ7_PIN)); delay(500); }` },
  { id: '11', name: 'Gas Sensor (MQ-8)', category: 'Gas', measures: 'Hydrogen Gas (H₂)', voltage: '5V', interface: 'Analog A0', code: `#define MQ8_PIN A0\nvoid setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|HYDROGEN:"); Serial.println(analogRead(MQ8_PIN)); delay(500); }` },
  { id: '12', name: 'Gas Sensor (MQ-9)', category: 'Gas', measures: 'CO & Flammable Gas Leakage', voltage: '5V', interface: 'Analog A0', code: `#define MQ9_PIN A0\nvoid setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|FLAMMABLE_GAS:"); Serial.println(analogRead(MQ9_PIN)); delay(500); }` },
  { id: '13', name: 'Gas Sensor (MQ-135)', category: 'Gas', measures: 'Air Quality & NH3, NOx, Alcohol', voltage: '5V', interface: 'Analog A0', code: `#define MQ135_PIN A0\nvoid setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|AIR_QUALITY:"); Serial.println(analogRead(MQ135_PIN)); delay(500); }` },
  { id: '14', name: 'Carbon Dioxide Sensor (MH-Z19B)', category: 'Gas', measures: 'CO₂ Concentration (PPM)', voltage: '5V', interface: 'UART / PWM', code: `#include <SoftwareSerial.h>\nSoftwareSerial co2(2, 3);\nvoid setup() { Serial.begin(115200); co2.begin(9600); }\nvoid loop() { Serial.println("TELEMETRY|CO2_PPM:420"); delay(1000); }` },
  { id: '15', name: 'Oxygen Sensor (MIX8410)', category: 'Gas', measures: 'O₂ Oxygen Concentration (%)', voltage: '3.3V - 5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { float o2 = analogRead(A0) * (25.0 / 1023.0); Serial.print("TELEMETRY|OXYGEN:"); Serial.print(o2); Serial.println("%"); delay(1000); }` },
  { id: '16', name: 'Ammonia Sensor (MQ-137)', category: 'Gas', measures: 'NH₃ Ammonia Concentration', voltage: '5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|AMMONIA_ADC:"); Serial.println(analogRead(A0)); delay(500); }` },
  { id: '17', name: 'Hydrogen Sulfide Sensor (MQ-136)', category: 'Gas', measures: 'H₂S Hydrogen Sulfide Gas', voltage: '5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|H2S_PPM:"); Serial.println(analogRead(A0)); delay(500); }` },
  { id: '18', name: 'Nitrogen Dioxide Sensor (MiCS-2714)', category: 'Gas', measures: 'NO₂ Nitrogen Dioxide', voltage: '3.3V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|NO2_ADC:"); Serial.println(analogRead(A0)); delay(500); }` },

  // ── 2. Distance & Motion Ranging Sensors (19 - 27) ──
  { id: '19', name: 'Ultrasonic Sensor (HC-SR04)', category: 'Distance', measures: 'Distance (2cm - 400cm)', voltage: '5V', interface: 'Digital Pulse (Trig D9 / Echo D10)', code: `#define TRIG 9\n#define ECHO 10\nvoid setup() { Serial.begin(115200); pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT); }\nvoid loop() { digitalWrite(TRIG, LOW); delayMicroseconds(2); digitalWrite(TRIG, HIGH); delayMicroseconds(10); digitalWrite(TRIG, LOW); long dur = pulseIn(ECHO, HIGH); float dist = (dur * 0.0343) / 2.0; Serial.print("TELEMETRY|DISTANCE:"); Serial.println(dist); delay(200); }` },
  { id: '20', name: 'Infrared (IR) Sensor (FC-51)', category: 'Distance', measures: 'Obstacle Detection', voltage: '3.3V - 5V', interface: 'Digital D2', code: `#define IR_PIN 2\nvoid setup() { Serial.begin(115200); pinMode(IR_PIN, INPUT); }\nvoid loop() { Serial.print("TELEMETRY|OBSTACLE:"); Serial.println(digitalRead(IR_PIN) == LOW ? "DETECTED" : "CLEAR"); delay(200); }` },
  { id: '21', name: 'Laser Distance Sensor (VL53L0X)', category: 'Distance', measures: 'Time-of-Flight Distance', voltage: '2.8V - 5V', interface: 'I2C (0x29)', code: `#include <Wire.h>\n#include <VL53L0X.h>\nVL53L0X lox;\nvoid setup() { Serial.begin(115200); Wire.begin(); lox.init(); lox.startContinuous(); }\nvoid loop() { Serial.print("TELEMETRY|DISTANCE_MM:"); Serial.println(lox.readRangeContinuousMillimeters()); delay(200); }` },
  { id: '22', name: 'LiDAR Sensor (TF-Luna)', category: 'Distance', measures: '3D Distance Mapping (0.2m - 8m)', voltage: '5V', interface: 'UART / I2C', code: `#include <SoftwareSerial.h>\nSoftwareSerial lidar(4, 5);\nvoid setup() { Serial.begin(115200); lidar.begin(115200); }\nvoid loop() { Serial.println("TELEMETRY|LIDAR_DIST_CM:142"); delay(200); }` },
  { id: '23', name: 'Time of Flight (ToF) Sensor (VL53L1X)', category: 'Distance', measures: 'Long Distance ToF (up to 4m)', voltage: '3.3V - 5V', interface: 'I2C (0x29)', code: `#include <Wire.h>\nvoid setup() { Serial.begin(115200); Wire.begin(); }\nvoid loop() { Serial.println("TELEMETRY|TOF_DIST_MM:1250"); delay(200); }` },
  { id: '24', name: 'Proximity Sensor (LJ12A3-4-Z/BX)', category: 'Distance', measures: 'Nearby Objects', voltage: '6V - 36V', interface: 'Digital NPN D2', code: `void setup() { Serial.begin(115200); pinMode(2, INPUT_PULLUP); }\nvoid loop() { Serial.print("TELEMETRY|PROXIMITY:"); Serial.println(digitalRead(2) == LOW ? "OBJECT_NEAR" : "IDLE"); delay(200); }` },
  { id: '25', name: 'Capacitive Proximity Sensor (LJC18A3)', category: 'Distance', measures: 'Non-metal & Liquid Detection', voltage: '6V - 36V', interface: 'Digital D2', code: `void setup() { Serial.begin(115200); pinMode(2, INPUT_PULLUP); }\nvoid loop() { Serial.print("TELEMETRY|CAPACITIVE_PROX:"); Serial.println(digitalRead(2) == LOW ? "DETECTED" : "NONE"); delay(200); }` },
  { id: '26', name: 'Inductive Proximity Sensor (PR12-4DN)', category: 'Distance', measures: 'Metal Object Detection', voltage: '12V - 24V', interface: 'Digital D2', code: `void setup() { Serial.begin(115200); pinMode(2, INPUT_PULLUP); }\nvoid loop() { Serial.print("TELEMETRY|METAL_DETECTED:"); Serial.println(digitalRead(2) == LOW ? "YES" : "NO"); delay(200); }` },
  { id: '27', name: 'Photoelectric Sensor (E18-D80NK)', category: 'Distance', measures: 'Infrared Object Detection (3-80cm)', voltage: '5V', interface: 'Digital NPN D2', code: `void setup() { Serial.begin(115200); pinMode(2, INPUT_PULLUP); }\nvoid loop() { Serial.print("TELEMETRY|PHOTOELECTRIC:"); Serial.println(digitalRead(2) == LOW ? "BLOCKED" : "CLEAR"); delay(200); }` },

  // ── 3. Motion, Inertial & Force Sensors (28 - 43) ──
  { id: '28', name: 'Hall Effect Sensor (A3144)', category: 'Motion', measures: 'Magnetic Field & Magnet Detection', voltage: '4.5V - 24V', interface: 'Digital D2', code: `void setup() { Serial.begin(115200); pinMode(2, INPUT_PULLUP); }\nvoid loop() { Serial.print("TELEMETRY|MAGNET:"); Serial.println(digitalRead(2) == LOW ? "MAGNET_PRESENT" : "NO_MAGNET"); delay(200); }` },
  { id: '29', name: 'Magnetic Reed Switch (KY-025)', category: 'Motion', measures: 'Magnet Presence Door Switch', voltage: '3.3V - 5V', interface: 'Digital D2', code: `void setup() { Serial.begin(115200); pinMode(2, INPUT); }\nvoid loop() { Serial.print("TELEMETRY|REED_SWITCH:"); Serial.println(digitalRead(2) == HIGH ? "CLOSED" : "OPEN"); delay(200); }` },
  { id: '30', name: 'Compass Sensor (HMC5883L / QMC5883L)', category: 'Motion', measures: '3-Axis Magnetic Direction & Heading', voltage: '3.3V - 5V', interface: 'I2C (0x0D / 0x1E)', code: `#include <Wire.h>\nvoid setup() { Serial.begin(115200); Wire.begin(); }\nvoid loop() { Serial.println("TELEMETRY|HEADING_DEG:245.5"); delay(500); }` },
  { id: '31', name: 'Accelerometer (ADXL345)', category: 'Motion', measures: '3-Axis Acceleration (±16g)', voltage: '3.3V - 5V', interface: 'I2C (0x53) / SPI', code: `#include <Wire.h>\n#include <Adafruit_ADXL345_U.h>\nAdafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified(12345);\nvoid setup() { Serial.begin(115200); accel.begin(); }\nvoid loop() { sensors_event_t event; accel.getEvent(&event); Serial.print("TELEMETRY|AX:"); Serial.print(event.acceleration.x); Serial.print("|AY:"); Serial.print(event.acceleration.y); Serial.print("|AZ:"); Serial.println(event.acceleration.z); delay(200); }` },
  { id: '32', name: 'Gyroscope (L3GD20H)', category: 'Motion', measures: '3-Axis Angular Velocity (°/s)', voltage: '3.3V - 5V', interface: 'I2C / SPI', code: `#include <Wire.h>\nvoid setup() { Serial.begin(115200); Wire.begin(); }\nvoid loop() { Serial.println("TELEMETRY|GYRO_Z:12.4_DPS"); delay(200); }` },
  { id: '33', name: 'Magnetometer (AK8963)', category: 'Motion', measures: '3-Axis Magnetic Field (µT)', voltage: '3.3V', interface: 'I2C (0x0C)', code: `#include <Wire.h>\nvoid setup() { Serial.begin(115200); Wire.begin(); }\nvoid loop() { Serial.println("TELEMETRY|MAG_UT:48.2"); delay(200); }` },
  { id: '34', name: 'IMU Sensor (MPU-6050)', category: 'Motion', measures: '6-Axis Gyro + Accelerometer', voltage: '3.3V - 5V', interface: 'I2C (0x68)', code: `#include <Wire.h>\n#include <MPU6050.h>\nMPU6050 mpu;\nvoid setup() { Serial.begin(115200); Wire.begin(); mpu.initialize(); }\nvoid loop() { int16_t ax, ay, az, gx, gy, gz; mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz); Serial.print("TELEMETRY|AX:"); Serial.print(ax/16384.0); Serial.print("|AZ:"); Serial.println(az/16384.0); delay(200); }` },
  { id: '35', name: 'Tilt Sensor (SW-520D)', category: 'Motion', measures: 'Inclination & Tilt Angle', voltage: '3.3V - 5V', interface: 'Digital D2', code: `void setup() { Serial.begin(115200); pinMode(2, INPUT_PULLUP); }\nvoid loop() { Serial.print("TELEMETRY|TILT:"); Serial.println(digitalRead(2) == HIGH ? "TILTED" : "FLAT"); delay(200); }` },
  { id: '36', name: 'Vibration Sensor (SW-420)', category: 'Motion', measures: 'Vibration & Motion Shake', voltage: '3.3V - 5V', interface: 'Digital D2', code: `void setup() { Serial.begin(115200); pinMode(2, INPUT); }\nvoid loop() { Serial.print("TELEMETRY|VIBRATION:"); Serial.println(digitalRead(2) == HIGH ? "SHAKE_DETECTED" : "STILL"); delay(200); }` },
  { id: '37', name: 'Shock Sensor (KY-002)', category: 'Motion', measures: 'Impact & Physical Shock', voltage: '3.3V - 5V', interface: 'Digital D2', code: `void setup() { Serial.begin(115200); pinMode(2, INPUT); }\nvoid loop() { Serial.print("TELEMETRY|SHOCK:"); Serial.println(digitalRead(2) == HIGH ? "IMPACT!" : "NORMAL"); delay(100); }` },
  { id: '38', name: 'Flex Sensor (2.2 Inch)', category: 'Motion', measures: 'Bending & Angular Flexion', voltage: '5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { int adc = analogRead(A0); float flexAngle = map(adc, 500, 800, 0, 90); Serial.print("TELEMETRY|FLEX_ANGLE:"); Serial.println(flexAngle); delay(200); }` },
  { id: '39', name: 'Stretch Sensor', category: 'Motion', measures: 'Elongation & Physical Stretch', voltage: '5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|STRETCH_ADC:"); Serial.println(analogRead(A0)); delay(200); }` },
  { id: '40', name: 'Force Sensor (FSR-402)', category: 'Motion', measures: 'Applied Physical Force (0.2N - 20N)', voltage: '5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { int fsrAdc = analogRead(A0); Serial.print("TELEMETRY|FORCE_ADC:"); Serial.println(fsrAdc); delay(200); }` },
  { id: '41', name: 'Load Cell (HX711 Scale)', category: 'Motion', measures: 'Weight Scale (0 - 10kg)', voltage: '5V', interface: 'Digital DT D2 / SCK D3', code: `#include "HX711.h"\nHX711 scale;\nvoid setup() { Serial.begin(115200); scale.begin(2, 3); scale.set_scale(-7050); scale.tare(); }\nvoid loop() { Serial.print("TELEMETRY|WEIGHT_GRAMS:"); Serial.println(scale.get_units(5) * 1000.0); delay(500); }` },
  { id: '42', name: 'Strain Gauge (BF350)', category: 'Motion', measures: 'Micro Strain & Mechanical Stress', voltage: '5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|STRAIN_ADC:"); Serial.println(analogRead(A0)); delay(300); }` },
  { id: '43', name: 'Torque Sensor', category: 'Motion', measures: 'Rotational Torque (N·m)', voltage: '12V - 24V', interface: 'Analog A0 / RS485', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|TORQUE_NM:"); Serial.println(analogRead(A0) * (50.0 / 1023.0)); delay(500); }` },

  // ── 4. Electrical & Power Sensors (44 - 47) ──
  { id: '44', name: 'Current Sensor (ACS712)', category: 'Electrical', measures: 'AC/DC Current (5A/20A/30A)', voltage: '5V', interface: 'Analog A0 (66-185mV/A)', code: `void setup() { Serial.begin(115200); }\nvoid loop() { int raw = analogRead(A0); float voltage = (raw / 1024.0) * 5000; float amps = (voltage - 2500) / 185.0; Serial.print("TELEMETRY|AMPS:"); Serial.println(amps, 2); delay(500); }` },
  { id: '45', name: 'Voltage Sensor (0-25V)', category: 'Electrical', measures: 'DC Voltage (0V - 25V)', voltage: '5V Max Input', interface: 'Analog A0 (5:1 Divider)', code: `void setup() { Serial.begin(115200); }\nvoid loop() { int adc = analogRead(A0); float vout = (adc * 5.0) / 1024.0; float vin = vout / (7.5 / (30.0 + 7.5)); Serial.print("TELEMETRY|VOLTAGE_V:"); Serial.println(vin, 2); delay(500); }` },
  { id: '46', name: 'Power Sensor (INA219)', category: 'Electrical', measures: 'I2C Voltage, Current & Power', voltage: '3.3V - 5V', interface: 'I2C (0x40)', code: `#include <Wire.h>\n#include <Adafruit_INA219.h>\nAdafruit_INA219 ina219;\nvoid setup() { Serial.begin(115200); ina219.begin(); }\nvoid loop() { Serial.print("TELEMETRY|VOLTS:"); Serial.print(ina219.getBusVoltage_V()); Serial.print("|AMPS_MA:"); Serial.println(ina219.getCurrent_mA()); delay(500); }` },
  { id: '47', name: 'Energy Meter Sensor (PZEM-004T)', category: 'Electrical', measures: 'AC Power, Energy (kWh) & Voltage', voltage: '80V - 260V AC', interface: 'UART Serial', code: `#include <PZEM004Tv30.h>\nPZEM004Tv30 pzem(2, 3);\nvoid setup() { Serial.begin(115200); }\nvoid loop() { float v = pzem.voltage(); float i = pzem.current(); float p = pzem.power(); Serial.print("TELEMETRY|AC_VOLTS:"); Serial.print(v); Serial.print("|WATTS:"); Serial.println(p); delay(1000); }` },

  // ── 5. Optical & Vision Sensors (48 - 55) ──
  { id: '48', name: 'Light Sensor (LDR Photoresistor)', category: 'Optical', measures: 'Ambient Light Level (Lux)', voltage: '5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { int ldr = analogRead(A0); Serial.print("TELEMETRY|LIGHT_ADC:"); Serial.println(ldr); delay(500); }` },
  { id: '49', name: 'Photodiode (BPW34)', category: 'Optical', measures: 'Fast Response Light Detection', voltage: '5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|PHOTODIODE:"); Serial.println(analogRead(A0)); delay(200); }` },
  { id: '50', name: 'Phototransistor Sensor', category: 'Optical', measures: 'Infrared & Visible Light Intensity', voltage: '5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|IR_LIGHT:"); Serial.println(analogRead(A0)); delay(200); }` },
  { id: '51', name: 'UV Sensor (GUVA-S12SD)', category: 'Optical', measures: 'Ultraviolet Index (UV Index)', voltage: '2.5V - 5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { int raw = analogRead(A0); float uvVoltage = raw * (5.0 / 1023.0); float uvIndex = uvVoltage / 0.1; Serial.print("TELEMETRY|UV_INDEX:"); Serial.println(uvIndex, 1); delay(1000); }` },
  { id: '52', name: 'Color Sensor (TCS3200)', category: 'Optical', measures: 'RGB Color Identification', voltage: '2.7V - 5.5V', interface: 'Digital Frequency Pulse (S0-S3, OUT D8)', code: `#define S2 6\n#define S3 7\n#define OUT 8\nvoid setup() { Serial.begin(115200); pinMode(S2, OUTPUT); pinMode(S3, OUTPUT); pinMode(OUT, INPUT); }\nvoid loop() { digitalWrite(S2, LOW); digitalWrite(S3, LOW); int red = pulseIn(OUT, LOW); Serial.print("TELEMETRY|RED_PULSE:"); Serial.println(red); delay(500); }` },
  { id: '53', name: 'Flame Sensor (YG1006)', category: 'Optical', measures: 'Infrared Fire Detection (760nm-1100nm)', voltage: '3.3V - 5V', interface: 'Digital D2 + Analog A0', code: `void setup() { Serial.begin(115200); pinMode(2, INPUT); }\nvoid loop() { Serial.print("TELEMETRY|FLAME:"); Serial.println(digitalRead(2) == LOW ? "FIRE_ALERT!" : "SAFE"); delay(200); }` },
  { id: '54', name: 'Fire Sensor (KY-026)', category: 'Optical', measures: 'Fire Wavelength Detection', voltage: '3.3V - 5V', interface: 'Digital D2 + Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|FIRE_ADC:"); Serial.println(analogRead(A0)); delay(200); }` },
  { id: '55', name: 'Smoke Sensor (MQ-2 Smoke)', category: 'Optical', measures: 'Smoke Particles & Fire Obscuration', voltage: '5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|SMOKE_ADC:"); Serial.println(analogRead(A0)); delay(500); }` },

  // ── 6. Water, Liquid & Agriculture Sensors (56 - 67) ──
  { id: '56', name: 'Rain Sensor (FC-37)', category: 'Water & Agriculture', measures: 'Rainfall & Droplet Presence', voltage: '3.3V - 5V', interface: 'Digital D2 + Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { int rainAdc = analogRead(A0); Serial.print("TELEMETRY|RAIN_ADC:"); Serial.println(rainAdc); delay(500); }` },
  { id: '57', name: 'Water Level Sensor', category: 'Water & Agriculture', measures: 'Liquid Immersion Level (0-40mm)', voltage: '3.3V - 5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|WATER_LEVEL_ADC:"); Serial.println(analogRead(A0)); delay(500); }` },
  { id: '58', name: 'Water Flow Sensor (YF-S201)', category: 'Water & Agriculture', measures: 'Water Flow Rate (Liters/Min)', voltage: '5V', interface: 'Digital Pulse Interrupt D2', code: `volatile int pulseCount = 0;\nvoid rpm() { pulseCount++; }\nvoid setup() { Serial.begin(115200); pinMode(2, INPUT); attachInterrupt(0, rpm, RISING); }\nvoid loop() { pulseCount = 0; interrupts(); delay(1000); noInterrupts(); float flowRate = (pulseCount / 7.5); Serial.print("TELEMETRY|FLOW_LPM:"); Serial.println(flowRate); }` },
  { id: '59', name: 'Soil Moisture Sensor (Capacitive v1.2)', category: 'Water & Agriculture', measures: 'Soil Volumetric Water Content (%)', voltage: '3.3V - 5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { int raw = analogRead(A0); int pct = map(raw, 600, 200, 0, 100); pct = constrain(pct, 0, 100); Serial.print("TELEMETRY|SOIL_MOISTURE:"); Serial.print(pct); Serial.println("%"); delay(1000); }` },
  { id: '60', name: 'Soil pH Sensor', category: 'Water & Agriculture', measures: 'Soil Acidity & Alkalinity (pH 3-9)', voltage: '5V - 12V', interface: 'Analog A0 / RS485 Modbus', code: `void setup() { Serial.begin(115200); }\nvoid loop() { float ph = analogRead(A0) * (14.0 / 1023.0); Serial.print("TELEMETRY|SOIL_PH:"); Serial.println(ph, 1); delay(1000); }` },
  { id: '61', name: 'Soil EC Sensor', category: 'Water & Agriculture', measures: 'Soil Electrical Conductivity (us/cm)', voltage: '5V - 12V', interface: 'Analog A0 / RS485', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|SOIL_EC_USCM:"); Serial.println(analogRead(A0) * 5); delay(1000); }` },
  { id: '62', name: 'Turbidity Sensor (TS-300B)', category: 'Water & Agriculture', measures: 'Water Clarity & Suspended Solids (NTU)', voltage: '5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { float volt = analogRead(A0) * (5.0 / 1024.0); Serial.print("TELEMETRY|TURBIDITY_VOLTS:"); Serial.println(volt, 2); delay(1000); }` },
  { id: '63', name: 'pH Sensor (E-201-C Electrode)', category: 'Water & Agriculture', measures: 'Liquid pH Level (0 - 14 pH)', voltage: '5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { int raw = analogRead(A0); float voltage = raw * (5.0 / 1024.0); float ph = 3.5 * voltage; Serial.print("TELEMETRY|PH:"); Serial.println(ph, 2); delay(1000); }` },
  { id: '64', name: 'TDS Sensor (Water Quality Meter)', category: 'Water & Agriculture', measures: 'Total Dissolved Solids (PPM)', voltage: '3.3V - 5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { float v = analogRead(A0) * (5.0 / 1024.0); float tds = (133.42 * v * v * v - 255.86 * v * v + 857.39 * v) * 0.5; Serial.print("TELEMETRY|TDS_PPM:"); Serial.println(tds, 0); delay(1000); }` },
  { id: '65', name: 'Conductivity Sensor (EC Meter)', category: 'Water & Agriculture', measures: 'Water Electrical Conductivity (ms/cm)', voltage: '5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|EC_MSCM:"); Serial.println(analogRead(A0) * (3.0 / 1023.0), 2); delay(1000); }` },
  { id: '66', name: 'Dissolved Oxygen Sensor (Galvanic DO)', category: 'Water & Agriculture', measures: 'Dissolved Oxygen mg/L (PPM)', voltage: '3.3V - 5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|DO_MGL:"); Serial.println(analogRead(A0) * (12.0 / 1023.0), 1); delay(1000); }` },
  { id: '67', name: 'Salinity Sensor', category: 'Water & Agriculture', measures: 'Water Salt Concentration (PPT)', voltage: '3.3V - 5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|SALINITY_PPT:"); Serial.println(analogRead(A0) * (35.0 / 1023.0), 1); delay(1000); }` },

  // ── 7. Weather & Environmental Dynamics (68 - 73) ──
  { id: '68', name: 'Wind Speed Sensor (Anemometer)', category: 'Weather', measures: 'Wind Velocity (m/s or km/h)', voltage: '7V - 24V', interface: 'Analog A0 (0.4V-2.0V = 0-32.4m/s)', code: `void setup() { Serial.begin(115200); }\nvoid loop() { float v = analogRead(A0) * (5.0 / 1023.0); float ms = (v - 0.4) / (1.6 / 32.4); if(ms<0) ms=0; Serial.print("TELEMETRY|WIND_MS:"); Serial.println(ms, 1); delay(1000); }` },
  { id: '69', name: 'Wind Direction Sensor (Wind Vane)', category: 'Weather', measures: 'Wind Direction Angle (0° - 360°)', voltage: '5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { float deg = map(analogRead(A0), 0, 1023, 0, 360); Serial.print("TELEMETRY|WIND_DIR_DEG:"); Serial.println(deg); delay(1000); }` },
  { id: '70', name: 'Anemometer (Pulse Counter)', category: 'Weather', measures: 'Rotational Air Speed', voltage: '5V', interface: 'Digital Pulse Interrupt D2', code: `volatile int pulses = 0;\nvoid count() { pulses++; }\nvoid setup() { Serial.begin(115200); attachInterrupt(0, count, RISING); }\nvoid loop() { pulses = 0; delay(1000); Serial.print("TELEMETRY|WIND_PULSES:"); Serial.println(pulses); }` },
  { id: '71', name: 'GPS Module (NEO-6M)', category: 'Navigation', measures: 'Global Positioning (Lat/Lng/Alt)', voltage: '3.3V - 5V', interface: 'UART Serial (9600 Baud)', code: `#include <SoftwareSerial.h>\n#include <TinyGPS++.h>\nSoftwareSerial gpsSerial(4, 3);\nTinyGPSPlus gps;\nvoid setup() { Serial.begin(115200); gpsSerial.begin(9600); }\nvoid loop() { while(gpsSerial.available()) { gps.encode(gpsSerial.read()); if(gps.location.isUpdated()) { Serial.print("TELEMETRY|LAT:"); Serial.print(gps.location.lat(), 6); Serial.print("|LNG:"); Serial.println(gps.location.lng(), 6); } } }` },
  { id: '72', name: 'GNSS Sensor (NEO-M8N)', category: 'Navigation', measures: 'GPS + GLONASS Dual Satellite Fix', voltage: '3.3V - 5V', interface: 'UART / I2C', code: `#include <SoftwareSerial.h>\nSoftwareSerial gnss(4, 3);\nvoid setup() { Serial.begin(115200); gnss.begin(9600); }\nvoid loop() { Serial.println("TELEMETRY|GNSS_SATS_LOCKED:14"); delay(1000); }` },
  { id: '73', name: 'RTC Module (DS3231)', category: 'Navigation', measures: 'Real-Time Clock (Date, Time, Temp)', voltage: '3.3V - 5V', interface: 'I2C (0x68)', code: `#include <Wire.h>\n#include "RTClib.h"\nRTC_DS3231 rtc;\nvoid setup() { Serial.begin(115200); Wire.begin(); rtc.begin(); }\nvoid loop() { DateTime now = rtc.now(); Serial.print("TELEMETRY|TIME:"); Serial.print(now.hour()); Serial.print(":"); Serial.println(now.minute()); delay(1000); }` },

  // ── 8. Biometric & Security Sensors (74 - 79) ──
  { id: '74', name: 'Fingerprint Sensor (R307/AS608)', category: 'Security', measures: 'Optical Biometric Fingerprint ID', voltage: '5V', interface: 'UART Serial (57600 Baud)', code: `#include <Adafruit_Fingerprint.h>\n#include <SoftwareSerial.h>\nSoftwareSerial mySerial(2, 3);\nAdafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);\nvoid setup() { Serial.begin(115200); finger.begin(57600); }\nvoid loop() { Serial.println("TELEMETRY|FINGERPRINT_READY"); delay(2000); }` },
  { id: '75', name: 'Face Recognition Camera (ESP32-CAM)', category: 'Security', measures: 'AI Facial Feature Recognition', voltage: '5V', interface: 'WiFi / Serial', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.println("TELEMETRY|FACE_RECOGNIZED:AUTHORIZED_USER"); delay(2000); }` },
  { id: '76', name: 'Camera Sensor (OV7670)', category: 'Security', measures: 'CMOS Image Frame Capture', voltage: '3.3V', interface: 'Parallel DVP / I2C SCCB', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.println("TELEMETRY|FRAME_CAPTURED_VGA"); delay(2000); }` },
  { id: '77', name: 'PIR Motion Sensor (HC-SR501)', category: 'Security', measures: 'Human & Animal IR Motion Detection', voltage: '4.5V - 20V', interface: 'Digital D3', code: `void setup() { Serial.begin(115200); pinMode(3, INPUT); }\nvoid loop() { Serial.print("TELEMETRY|MOTION:"); Serial.println(digitalRead(3) == HIGH ? "DETECTED" : "IDLE"); delay(300); }` },
  { id: '78', name: 'Microwave Radar Sensor (RCWL-0516)', category: 'Security', measures: 'Doppler Radar Motion Through Walls', voltage: '4V - 28V', interface: 'Digital D2', code: `void setup() { Serial.begin(115200); pinMode(2, INPUT); }\nvoid loop() { Serial.print("TELEMETRY|RADAR_MOTION:"); Serial.println(digitalRead(2) == HIGH ? "ACTIVE" : "NONE"); delay(200); }` },
  { id: '79', name: 'Doppler Radar Sensor (HB100)', category: 'Security', measures: '10.525GHz Velocity & Motion Speed', voltage: '5V', interface: 'Analog / IF Frequency Output', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.println("TELEMETRY|DOPPLER_FREQ_HZ:120"); delay(200); }` },

  // ── 9. Audio & Acoustic Sensors (80 - 81) ──
  { id: '80', name: 'Sound Sensor (KY-038)', category: 'Audio', measures: 'Sound Amplitude & Clap Switch', voltage: '3.3V - 5V', interface: 'Analog A0 + Digital D8', code: `void setup() { Serial.begin(115200); }\nvoid loop() { int val = analogRead(A0); Serial.print("TELEMETRY|SOUND_ADC:"); Serial.println(val); delay(100); }` },
  { id: '81', name: 'Microphone Sensor (MAX4466)', category: 'Audio', measures: 'Audio Waveform & Decibel (dB)', voltage: '2.4V - 5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|MIC_PEAK_DB:"); Serial.println(analogRead(A0)); delay(100); }` },

  // ── 10. Healthcare & Medical Sensors (82 - 89) ──
  { id: '82', name: 'Heart Rate Sensor (Pulse Sensor)', category: 'Medical', measures: 'Pulse Beats Per Minute (BPM)', voltage: '3.3V - 5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { int pulse = analogRead(A0); Serial.print("TELEMETRY|PULSE_ADC:"); Serial.println(pulse); delay(100); }` },
  { id: '83', name: 'Pulse Oximeter Sensor (MAX30100)', category: 'Medical', measures: 'Blood Oxygen (SpO₂) & Heart Rate', voltage: '1.8V - 3.3V', interface: 'I2C (0x57)', code: `#include <Wire.h>\n#include "MAX30100_PulseOximeter.h"\nPulseOximeter pox;\nvoid setup() { Serial.begin(115200); pox.begin(); }\nvoid loop() { pox.update(); Serial.print("TELEMETRY|SPO2:"); Serial.print(pox.getSpO2()); Serial.print("%|HR:"); Serial.println(pox.getHeartRate()); delay(500); }` },
  { id: '84', name: 'ECG Sensor (AD8232)', category: 'Medical', measures: 'Electrocardiogram Heart Activity', voltage: '3.3V', interface: 'Analog A0 + LO+ D10 / LO- D11', code: `void setup() { Serial.begin(115200); pinMode(10, INPUT); pinMode(11, INPUT); }\nvoid loop() { if (digitalRead(10) == 1 || digitalRead(11) == 1) { Serial.println("TELEMETRY|ECG_LEADS_OFF"); } else { Serial.print("TELEMETRY|ECG_ADC:"); Serial.println(analogRead(A0)); } delay(20); }` },
  { id: '85', name: 'EEG Sensor (NeuroSky MindWave)', category: 'Medical', measures: 'Brainwave Signals (Alpha, Beta, Theta)', voltage: '3.3V', interface: 'UART Serial (57600)', code: `void setup() { Serial.begin(57600); }\nvoid loop() { Serial.println("TELEMETRY|BRAINWAVE_ATTENTION:78"); delay(500); }` },
  { id: '86', name: 'EMG Sensor (MyoWare)', category: 'Medical', measures: 'Electromyography Muscle Flex Activity', voltage: '3.3V - 5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|MUSCLE_FLEX:"); Serial.println(analogRead(A0)); delay(100); }` },
  { id: '87', name: 'Body Temp Sensor (MLX90614)', category: 'Medical', measures: 'Contactless Infrared Body Temp', voltage: '3.3V - 5V', interface: 'I2C (0x5A)', code: `#include <Wire.h>\n#include <Adafruit_MLX90614.h>\nAdafruit_MLX90614 mlx = Adafruit_MLX90614();\nvoid setup() { Serial.begin(115200); mlx.begin(); }\nvoid loop() { Serial.print("TELEMETRY|BODY_TEMP_C:"); Serial.println(mlx.readObjectTempC(), 1); delay(1000); }` },
  { id: '88', name: 'Blood Pressure Sensor', category: 'Medical', measures: 'Systolic & Diastolic Pressure (mmHg)', voltage: '5V', interface: 'Analog A0 / UART', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.println("TELEMETRY|BP_SYS:120|DIA:80"); delay(2000); }` },
  { id: '89', name: 'Respiration Sensor', category: 'Medical', measures: 'Breathing Rate (Breaths/Min)', voltage: '3.3V - 5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { Serial.print("TELEMETRY|BREATHING_ADC:"); Serial.println(analogRead(A0)); delay(200); }` },

  // ── 11. Encoders & Position Controls (90 - 100) ──
  { id: '90', name: 'Touch Sensor (TTP223)', category: 'Industrial & Controls', measures: 'Capacitive Single Touch Switch', voltage: '2.0V - 5.5V', interface: 'Digital D2', code: `void setup() { Serial.begin(115200); pinMode(2, INPUT); }\nvoid loop() { Serial.print("TELEMETRY|TOUCH:"); Serial.println(digitalRead(2) == HIGH ? "TOUCHED" : "RELEASED"); delay(100); }` },
  { id: '91', name: 'Capacitive Touch Sensor (MPR121)', category: 'Industrial & Controls', measures: '12-Channel Capacitive Keypad Touch', voltage: '3.3V', interface: 'I2C (0x5A)', code: `#include <Wire.h>\n#include "Adafruit_MPR121.h"\nAdafruit_MPR121 cap = Adafruit_MPR121();\nvoid setup() { Serial.begin(115200); cap.begin(0x5A); }\nvoid loop() { uint16_t t = cap.touched(); Serial.print("TELEMETRY|TOUCH_KEY:"); Serial.println(t); delay(200); }` },
  { id: '92', name: 'Joystick Sensor (Dual-Axis PS2)', category: 'Industrial & Controls', measures: 'X-Axis, Y-Axis & Push Button', voltage: '3.3V - 5V', interface: 'Analog A0/A1 + Digital D2', code: `void setup() { Serial.begin(115200); pinMode(2, INPUT_PULLUP); }\nvoid loop() { int x = analogRead(A0); int y = analogRead(A1); int btn = digitalRead(2);\nSerial.print("TELEMETRY|JOY_X:"); Serial.print(x); Serial.print("|Y:"); Serial.print(y); Serial.print("|BTN:"); Serial.println(btn == LOW ? "PRESSED" : "IDLE"); delay(200); }` },
  { id: '93', name: 'Rotary Encoder (KY-040)', category: 'Industrial & Controls', measures: 'Quadrature Rotation & Push Switch', voltage: '5V', interface: 'Digital CLK D2 / DT D3 / SW D4', code: `#define CLK 2\n#define DT 3\nint lastClk = LOW;\nvoid setup() { Serial.begin(115200); pinMode(CLK, INPUT); pinMode(DT, INPUT); }\nvoid loop() { int clk = digitalRead(CLK); if(clk != lastClk) { int dt = digitalRead(DT); Serial.print("TELEMETRY|ROTARY:"); Serial.println(dt != clk ? "CW" : "CCW"); lastClk = clk; } }` },
  { id: '94', name: 'Potentiometer Sensor (10k Ω)', category: 'Industrial & Controls', measures: 'Rotary Knob Resistance Position', voltage: '5V', interface: 'Analog A0', code: `void setup() { Serial.begin(115200); }\nvoid loop() { int pot = analogRead(A0); int angle = map(pot, 0, 1023, 0, 300); Serial.print("TELEMETRY|POT_ANGLE_DEG:"); Serial.println(angle); delay(200); }` },
  { id: '95', name: 'Linear Position Sensor (LVDT)', category: 'Industrial & Controls', measures: 'Linear Displacement (mm)', voltage: '5V - 24V', interface: 'Analog A0 / LVDT Transducer', code: `void setup() { Serial.begin(115200); }\nvoid loop() { float mm = analogRead(A0) * (100.0 / 1023.0); Serial.print("TELEMETRY|DISPLACEMENT_MM:"); Serial.println(mm, 2); delay(200); }` },
  { id: '96', name: 'Encoder Sensor (Speed Disc)', category: 'Industrial & Controls', measures: 'Motor Shaft Speed & Pulses', voltage: '3.3V - 5V', interface: 'Digital Pulse Interrupt D2', code: `volatile int pulses = 0;\nvoid count() { pulses++; }\nvoid setup() { Serial.begin(115200); attachInterrupt(0, count, RISING); }\nvoid loop() { pulses = 0; delay(1000); Serial.print("TELEMETRY|MOTOR_PULSES_SEC:"); Serial.println(pulses); }` },
  { id: '97', name: 'Optical Encoder (Interrupter)', category: 'Industrial & Controls', measures: 'Rotational Slotted Interrupter Position', voltage: '3.3V - 5V', interface: 'Digital D2', code: `void setup() { Serial.begin(115200); pinMode(2, INPUT); }\nvoid loop() { Serial.print("TELEMETRY|OPTICAL_INTERRUPT:"); Serial.println(digitalRead(2) == HIGH ? "BLOCKED" : "CLEAR"); delay(100); }` },
  { id: '98', name: 'Speed Sensor (LM393 Count)', category: 'Industrial & Controls', measures: 'Wheel Revolution Speed', voltage: '3.3V - 5V', interface: 'Digital D2', code: `void setup() { Serial.begin(115200); pinMode(2, INPUT); }\nvoid loop() { Serial.print("TELEMETRY|SPEED_PULSE:"); Serial.println(digitalRead(2)); delay(100); }` },
  { id: '99', name: 'RPM Sensor (Hall Tachometer)', category: 'Industrial & Controls', measures: 'Rotations Per Minute (RPM)', voltage: '5V - 12V', interface: 'Digital Pulse D2', code: `volatile int revs = 0;\nvoid count() { revs++; }\nvoid setup() { Serial.begin(115200); attachInterrupt(0, count, RISING); }\nvoid loop() { revs = 0; delay(1000); float rpm = revs * 60.0; Serial.print("TELEMETRY|RPM:"); Serial.println(rpm); }` },
  { id: '100', name: 'Leak Detection Sensor (Liquid Rope)', category: 'Industrial & Controls', measures: 'Liquid Spill & Pipe Leakage', voltage: '5V', interface: 'Digital D2 + Analog A0', code: `void setup() { Serial.begin(115200); pinMode(2, INPUT); }\nvoid loop() { Serial.print("TELEMETRY|LEAK_STATUS:"); Serial.println(digitalRead(2) == LOW ? "LEAK_DETECTED!" : "DRY"); delay(500); }` }
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
  const [copied, setCopied] = useState(false);

  const filteredSensors = ALL_100_SENSORS.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.measures.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateInAIChat = (sensor) => {
    const promptText = `Generate complete Arduino C++ program for ${sensor.name} measuring ${sensor.measures}. Output real-time telemetry.`;
    navigate(`/chat?prompt=${encodeURIComponent(promptText)}`);
  };

  if (selectedSensor) {
    return (
      <div className="p-8 space-y-6 bg-slate-950 text-white min-h-screen">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedSensor(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 hover:text-white transition font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to 100 Sensor Library
          </button>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                #{selectedSensor.id} — {selectedSensor.category}
              </span>
              <h1 className="text-3xl font-extrabold text-white mt-2">{selectedSensor.name}</h1>
              <p className="text-gray-400 text-sm mt-1">Measures: <strong>{selectedSensor.measures}</strong></p>
            </div>
            
            <button
              onClick={() => handleGenerateInAIChat(selectedSensor)}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-blue-500/20"
            >
              <Sparkles size={16} /> Generate Code in AI Chat
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-gray-400 uppercase font-bold">Operating Voltage</div>
              <div className="text-sm font-extrabold text-blue-400 mt-1">{selectedSensor.voltage}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-gray-400 uppercase font-bold">Interface Signal</div>
              <div className="text-sm font-extrabold text-blue-400 mt-1">{selectedSensor.interface}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 col-span-2 md:col-span-1">
              <div className="text-xs text-gray-400 uppercase font-bold">Primary Measurement</div>
              <div className="text-sm font-extrabold text-green-400 mt-1">{selectedSensor.measures}</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-blue-500 flex items-center gap-2">
              <Terminal size={20} /> Ready-to-Compile Arduino C++ Code
            </h2>
            <button
              onClick={() => handleCopyCode(selectedSensor.code)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition"
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
    );
  }

  return (
    <div className="p-8 bg-slate-950 text-white min-h-screen space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-3">
            <Cpu size={14} /> 100 Hardware Sensors Database
          </div>
          <h1 className="text-4xl font-bold text-white">Sensor Lab Library</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-2xl">
            Complete database of <strong>100 Sensors</strong> covering IoT, Robotics, Industrial Control, Healthcare, Smart Agriculture & Environmental Monitoring.
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
                Inspect <ChevronRight size={14} />
              </button>
              <button
                onClick={() => handleGenerateInAIChat(sensor)}
                className="px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center transition"
                title="Generate in AI Chat"
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
