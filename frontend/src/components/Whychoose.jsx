import {
  CheckCircle,
  Brain,
  Zap,
  Shield,
  Cpu,
  BookOpen,
} from "lucide-react";

const items = [
  {
    icon: <Brain size={40} className="text-blue-500" />,
    title: "AI Powered",
    desc: "Generate Arduino code in seconds.",
  },
  {
    icon: <Zap size={40} className="text-yellow-400" />,
    title: "Fast Development",
    desc: "Reduce development time significantly.",
  },
  {
    icon: <Cpu size={40} className="text-green-400" />,
    title: "Arduino UNO Focused",
    desc: "Built specifically for Arduino UNO projects.",
  },
  {
    icon: <BookOpen size={40} className="text-purple-400" />,
    title: "Learning Friendly",
    desc: "Perfect for students and beginners.",
  },
  {
    icon: <Shield size={40} className="text-red-400" />,
    title: "Reliable",
    desc: "Organized code and reusable templates.",
  },
  {
    icon: <CheckCircle size={40} className="text-cyan-400" />,
    title: "All-in-One",
    desc: "Chat, code, modules and documentation together.",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-slate-950 py-24">

      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-5xl font-bold text-center text-white">
          Why Choose AI SENSE?
        </h2>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-16">

          {items.map((item, index) => (

            <div
              key={index}
              className="bg-slate-900 rounded-3xl p-8 border border-slate-800 hover:border-blue-500 transition"
            >

              {item.icon}

              <h3 className="text-2xl text-white font-bold mt-6">
                {item.title}
              </h3>

              <p className="text-gray-400 mt-4">
                {item.desc}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}