import {
  CheckCircle,
  Brain,
  Zap,
  ShieldCheck,
  Cpu,
  BookOpen,
  Activity,
  Wrench,
  Sparkles
} from "lucide-react";

const items = [
  {
    icon: <Brain size={36} className="text-blue-500" />,
    title: "AI Code Generation",
    desc: "Answers: 'What code should I write?' by synthesizing exact Arduino C++ code & circuit pinouts.",
  },
  {
    icon: <ShieldCheck size={36} className="text-green-400" />,
    title: "QC Hardware Inspection",
    desc: "Answers: 'Is my hardware actually working?' by evaluating live WebSerial telemetry against nominal specs.",
  },
  {
    icon: <Wrench size={36} className="text-amber-400" />,
    title: "Root-Cause Hardware Debugger",
    desc: "Answers: 'If not, why?' by providing step-by-step diagnostics for pull-ups, power drops, & baud rates.",
  },
  {
    icon: <Cpu size={36} className="text-purple-400" />,
    title: "Arduino UNO Q SBC Ready",
    desc: "Built specifically for Qualcomm Dragonwing QRB2210 + STM32U585 ARM Cortex-M33 dual-core hardware.",
  },
  {
    icon: <BookOpen size={36} className="text-cyan-400" />,
    title: "100 Sensor Library",
    desc: "Complete hardware datasheets, sensing physics, and pinout maps for 100 electronics sensors.",
  },
  {
    icon: <Activity size={36} className="text-rose-400" />,
    title: "RUN Studio WebSerial",
    desc: "Real-time 115200 baud serial monitor & live telemetry stream directly inside the browser.",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-slate-950 py-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-8 space-y-12">

        {/* Vision Statement Hero Banner */}
        <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-950 p-8 rounded-3xl border border-blue-500/30 text-center space-y-4 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Sparkles size={14} /> Core Platform Philosophy
          </div>

          <blockquote className="text-xl md:text-2xl font-extrabold text-white max-w-4xl mx-auto leading-relaxed italic">
            “Our goal is simple: instead of asking the developer only <span className="text-blue-400 font-normal">‘What code should I write?’</span>, AI SENSE also helps answer <span className="text-green-400 font-normal">‘Is my hardware actually working, and if not, why?’</span>”
          </blockquote>

          <p className="text-xs text-gray-400 font-mono">
            — AI SENSE Embedded Hardware & Quality Inspection Engine
          </p>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white">Why Choose AI SENSE?</h2>
          <p className="text-sm text-gray-400 mt-2">The complete dual-engine platform for hardware developers and IoT engineers.</p>
        </div>

        {/* Feature Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-slate-900 rounded-3xl p-8 border border-slate-800 hover:border-blue-500 transition group flex flex-col justify-between"
            >
              <div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 w-fit group-hover:border-blue-500/50 transition">
                  {item.icon}
                </div>

                <h3 className="text-xl text-white font-extrabold mt-6">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}