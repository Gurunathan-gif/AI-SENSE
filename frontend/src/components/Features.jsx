import {
  Bot,
  Cpu,
  BookOpen,
  PlayCircle,
  Code,
  Wifi,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Bot size={40} className="text-blue-500" />,
      title: "AI Code Generator",
      description:
        "Generate Arduino programs instantly using Artificial Intelligence.",
    },
    {
      icon: <Cpu size={40} className="text-green-500" />,
      title: "Arduino Support",
      description:
        "Supports Arduino UNO, Nano, Mega, ESP32 and Raspberry Pi Pico.",
    },
    {
      icon: <BookOpen size={40} className="text-yellow-500" />,
      title: "Module Library",
      description:
        "Browse sensors, displays, motors and communication modules.",
    },
    {
      icon: <PlayCircle size={40} className="text-red-500" />,
      title: "RUN Studio",
      description:
        "Edit, compile and upload Arduino sketches from one place.",
    },
    {
      icon: <Code size={40} className="text-purple-500" />,
      title: "Example Programs",
      description:
        "Ready-to-use code examples for beginners and professionals.",
    },
    {
      icon: <Wifi size={40} className="text-cyan-500" />,
      title: "IoT Development",
      description:
        "Develop IoT applications with ESP32 and Wi-Fi-enabled boards.",
    },
  ];

  return (
    <section
      id="features"
      className="bg-slate-950 py-24 px-8"
    >
      <div className="max-w-7xl mx-auto">

        <h2 className="text-5xl font-bold text-center text-white">
          Powerful Features
        </h2>

        <p className="text-center text-gray-400 mt-5 text-lg">
          Everything you need to design, program and deploy Arduino projects.
        </p>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-16">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-900 rounded-3xl p-8 border border-slate-800 hover:border-blue-500 hover:scale-105 transition duration-300"
            >
              {feature.icon}

              <h3 className="text-2xl font-bold text-white mt-6">
                {feature.title}
              </h3>

              <p className="text-gray-400 mt-4 leading-7">
                {feature.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}