import { Search, Cpu, ArrowRight } from "lucide-react";

export default function Modules() {

  const modules = [
    {
      name: "LED",
      category: "Output",
      desc: "Blink and control LEDs using Arduino UNO."
    },
    {
      name: "Push Button",
      category: "Input",
      desc: "Read digital input from push buttons."
    },
    {
      name: "Servo Motor",
      category: "Motor",
      desc: "Rotate servo motors accurately."
    },
    {
      name: "Ultrasonic Sensor",
      category: "Sensor",
      desc: "Measure distance using HC-SR04."
    },
    {
      name: "DHT11",
      category: "Sensor",
      desc: "Temperature & Humidity Sensor."
    },
    {
      name: "LCD 16x2 I2C",
      category: "Display",
      desc: "Display text and sensor values."
    },
    {
      name: "Relay",
      category: "Output",
      desc: "Switch high voltage devices."
    },
    {
      name: "Bluetooth HC-05",
      category: "Communication",
      desc: "Wireless Serial Communication."
    }
  ];

  return (

<div className="min-h-screen bg-slate-950 text-white">

<div className="bg-slate-900 p-6 border-b border-slate-800">

<h1 className="text-4xl font-bold text-blue-500">
Module Library
</h1>

<div className="flex items-center bg-slate-800 rounded-xl mt-6 px-5">

<Search/>

<input
className="bg-transparent outline-none p-4 w-full"
placeholder="Search Module..."
/>

</div>

</div>

<div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 p-8">

{modules.map((module,index)=>(

<div
key={index}
className="bg-slate-900 rounded-3xl p-6 border border-slate-800 hover:border-blue-500 transition"
>

<div className="flex justify-center">

<Cpu size={70} className="text-blue-500"/>

</div>

<h2 className="text-2xl font-bold mt-6">
{module.name}
</h2>

<p className="text-blue-400 mt-2">
{module.category}
</p>

<p className="text-gray-400 mt-5">
{module.desc}
</p>

<button className="mt-6 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl flex items-center gap-2">

View Module

<ArrowRight size={18}/>

</button>

</div>

))}

</div>

</div>

  );

}