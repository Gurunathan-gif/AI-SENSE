import { Link } from "react-router-dom";
import { Cpu, Bot, Code2, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-8 items-center">

        {/* Left Side */}

        <div>

          <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
            🚀 AI Powered Arduino Development Platform
          </span>

          <h1 className="text-6xl font-extrabold text-white mt-8 leading-tight">
            Build Arduino Projects
            <br />
            with
            <span className="text-blue-500"> AI SENSE</span>
          </h1>

          <p className="text-gray-400 text-xl mt-8 leading-8">
            Generate Arduino code using Artificial Intelligence,
            browse electronic modules, upload sketches,
            and build smart embedded systems faster than ever.
          </p>

          <div className="flex gap-5 mt-10">

            <Link to="/register">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl flex items-center gap-2">
                Get Started
                <ArrowRight size={20}/>
              </button>
            </Link>

            <Link to="/login">
              <button className="border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-xl">
                Login
              </button>
            </Link>

          </div>

          {/* Statistics */}

          <div className="grid grid-cols-3 gap-8 mt-16">

            <div>
              <h2 className="text-4xl font-bold text-blue-400">
                120+
              </h2>

              <p className="text-gray-400 mt-2">
                Modules
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-green-400">
                30+
              </h2>

              <p className="text-gray-400 mt-2">
                AI Templates
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-yellow-400">
                15+
              </h2>

              <p className="text-gray-400 mt-2">
                Boards
              </p>
            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="flex justify-center">

          <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-8 w-full max-w-lg">

            <div className="flex items-center gap-3 mb-6">

              <Bot className="text-blue-500" size={40}/>

              <div>

                <h2 className="text-2xl font-bold text-white">
                  AI Assistant
                </h2>

                <p className="text-green-400">
                  ● Online
                </p>

              </div>

            </div>

            <div className="bg-slate-800 rounded-2xl p-5">

              <p className="text-white">
                Generate Arduino code for blinking an LED.
              </p>

            </div>

            <div className="bg-blue-600 rounded-2xl p-5 mt-5">

              <Code2 size={30} className="mb-3"/>

              <pre className="text-sm text-white overflow-x-auto">
{`void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`}
              </pre>

            </div>

            <div className="flex justify-between mt-6">

              <button className="bg-green-600 px-5 py-3 rounded-xl">
                Copy Code
              </button>

              <button className="bg-yellow-500 px-5 py-3 rounded-xl text-black">
                Open in RUN
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}