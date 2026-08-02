import {
  Lightbulb,
  Thermometer,
  Monitor,
  Radio,
  Gauge,
  Power,
  ArrowRight,
} from "lucide-react";

const modules = [
  {
    icon: <Lightbulb size={40} className="text-yellow-400" />,
    title: "LED",
    desc: "Blink, fade and control LEDs using Arduino UNO.",
  },
  {
    icon: <Thermometer size={40} className="text-red-400" />,
    title: "DHT11",
    desc: "Read temperature and humidity values.",
  },
  {
    icon: <Gauge size={40} className="text-green-400" />,
    title: "Ultrasonic Sensor",
    desc: "Measure distance accurately.",
  },
  {
    icon: <Monitor size={40} className="text-blue-400" />,
    title: "LCD 16x2 I2C",
    desc: "Display text and sensor values.",
  },
  {
    icon: <Radio size={40} className="text-purple-400" />,
    title: "HC-05 Bluetooth",
    desc: "Wireless communication with Arduino.",
  },
  {
    icon: <Power size={40} className="text-orange-400" />,
    title: "Relay Module",
    desc: "Control AC and DC appliances safely.",
  },
];

export default function ModulePreview() {
  return (
    <section className="bg-slate-900 py-24">

      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-5xl font-bold text-center text-white">
          Arduino Module Library
        </h2>

        <p className="text-center text-gray-400 mt-4">
          Explore commonly used Arduino modules supported by AI SENSE.
        </p>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-16">

          {modules.map((module, index) => (

            <div
              key={index}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-8 hover:border-blue-500 hover:-translate-y-2 transition"
            >

              {module.icon}

              <h3 className="text-2xl font-bold text-white mt-6">
                {module.title}
              </h3>

              <p className="text-gray-400 mt-4 leading-7">
                {module.desc}
              </p>

              <button className="mt-6 flex items-center gap-2 text-blue-400 hover:text-blue-300">
                Learn More
                <ArrowRight size={18} />
              </button>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}