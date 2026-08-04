import { Link } from "react-router-dom";
import { Cpu, Bot, Code2, ArrowRight, Server, ShieldCheck, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center pt-20 pb-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-8 items-center">

        {/* Left Side */}
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-full text-xs font-bold">
            <Cpu size={16} className="text-blue-400" /> Powered by Arduino UNO Q Single Board Computer
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold text-white mt-6 leading-tight">
            Build Hybrid AI Projects
            <br />
            with <span className="text-blue-500">Arduino UNO Q</span>
          </h1>

          <p className="text-gray-400 text-lg mt-6 leading-relaxed">
            AI SENSE harnesses the dual-processor architecture of the <strong>Arduino UNO Q</strong>:
            Qualcomm Dragonwing QRB2210 Quad-Core AP (Debian Linux) + STM32U585 ARM Cortex-M33 Coprocessor, paired with Google Gemini AI for instant code synthesis & sensor diagnostics.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link to="/register">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition">
                Get Started <ArrowRight size={20}/>
              </button>
            </Link>

            <Link to="/documentation">
              <button className="border border-slate-700 text-gray-300 hover:text-white hover:bg-slate-800 px-8 py-4 rounded-xl font-bold transition flex items-center gap-2">
                UNO Q Datasheet <Zap size={18} className="text-blue-400" />
              </button>
            </Link>
          </div>

          {/* UNO Q Specs Matrix Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12 pt-8 border-t border-slate-800/80">
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-gray-400">Board</div>
              <div className="text-xs font-black text-blue-400 mt-0.5">Arduino UNO Q</div>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-gray-400">App Processor</div>
              <div className="text-xs font-black text-purple-400 mt-0.5">Qualcomm QRB2210</div>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-gray-400">Microcontroller</div>
              <div className="text-xs font-black text-green-400 mt-0.5">STM32U585 M33</div>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-gray-400">AI Engine</div>
              <div className="text-xs font-black text-amber-400 mt-0.5">Google Gemini API</div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex justify-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 w-full max-w-lg space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Bot size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AI SENSE Code Engine</h2>
                <p className="text-xs text-green-400 font-bold">● Arduino UNO Q Single Board Target Ready</p>
              </div>
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-xs text-gray-300">
              Generate TCS3200 Color & R307 Fingerprint sensor telemetry code for Arduino UNO Q.
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 font-mono text-xs text-green-400 overflow-x-auto max-h-48">
              <pre>{`/*
 * AI SENSE — Arduino UNO Q Target
 * Qualcomm QRB2210 + STM32U585 Dual Core
 */
#define SENSOR_PIN A0
void setup() {
  Serial.begin(115200);
}
void loop() {
  int raw = analogRead(SENSOR_PIN);
  Serial.print("TELEMETRY|ADC:"); Serial.println(raw);
  delay(200);
}`}</pre>
            </div>

            <div className="flex gap-3 pt-2">
              <Link to="/chat" className="flex-1">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition">
                  Open in AI Code Studio
                </button>
              </Link>
              <Link to="/sensors" className="flex-1">
                <button className="w-full bg-slate-800 hover:bg-slate-700 text-gray-200 font-bold text-xs py-3 rounded-xl transition border border-slate-700">
                  100 Sensor Library
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}