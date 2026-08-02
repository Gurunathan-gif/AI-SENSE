import { Cpu, Bot, Code2, Users } from "lucide-react";

export default function Stats() {
  const stats = [
    {
      icon: <Cpu size={40} className="text-blue-500" />,
      number: "15+",
      title: "Supported Boards",
    },
    {
      icon: <Bot size={40} className="text-green-500" />,
      number: "30+",
      title: "AI Templates",
    },
    {
      icon: <Code2 size={40} className="text-yellow-400" />,
      number: "120+",
      title: "Arduino Modules",
    },
    {
      icon: <Users size={40} className="text-purple-500" />,
      number: "1000+",
      title: "Generated Projects",
    },
  ];

  return (
    <section className="bg-slate-950 py-24">

      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-5xl font-bold text-center text-white">
          AI SENSE in Numbers
        </h2>

        <p className="text-center text-gray-400 mt-4 text-lg">
          Everything you need for Arduino development in one platform.
        </p>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mt-16">

          {stats.map((item, index) => (

            <div
              key={index}
              className="bg-slate-900 rounded-3xl border border-slate-800 p-8 text-center hover:border-blue-500 transition"
            >

              <div className="flex justify-center">
                {item.icon}
              </div>

              <h3 className="text-5xl font-bold text-white mt-6">
                {item.number}
              </h3>

              <p className="text-gray-400 mt-3">
                {item.title}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}