import {
  Lightbulb,
  Bot,
  Code2,
  PlayCircle,
  Upload,
  Rocket,
} from "lucide-react";

export default function Workflow() {
  const steps = [
    {
      icon: <Lightbulb size={40} className="text-yellow-400" />,
      title: "1. Enter Your Idea",
      desc: "Describe your Arduino project in simple English.",
    },
    {
      icon: <Bot size={40} className="text-blue-500" />,
      title: "2. AI Generates Code",
      desc: "AI SENSE creates optimized Arduino code instantly.",
    },
    {
      icon: <Code2 size={40} className="text-green-500" />,
      title: "3. Edit the Code",
      desc: "Modify the generated program inside RUN Studio.",
    },
    {
      icon: <PlayCircle size={40} className="text-red-500" />,
      title: "4. Compile",
      desc: "Compile the Arduino sketch with one click.",
    },
    {
      icon: <Upload size={40} className="text-cyan-400" />,
      title: "5. Upload",
      desc: "Upload directly to your Arduino board.",
    },
    {
      icon: <Rocket size={40} className="text-purple-500" />,
      title: "6. Run Project",
      desc: "Execute and test your embedded application.",
    },
  ];

  return (
    <section
      id="workflow"
      className="bg-slate-900 py-24 px-8"
    >
      <div className="max-w-7xl mx-auto">

        <h2 className="text-5xl font-bold text-center text-white">
          How AI SENSE Works
        </h2>

        <p className="text-gray-400 text-center mt-5 text-lg">
          Build Arduino projects in six simple steps.
        </p>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-16">

          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-slate-950 rounded-3xl border border-slate-800 p-8 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300"
            >
              {step.icon}

              <h3 className="text-2xl font-bold text-white mt-6">
                {step.title}
              </h3>

              <p className="text-gray-400 mt-4 leading-7">
                {step.desc}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}