import { Bot, User, Copy, PlayCircle } from "lucide-react";

export default function AIPreview() {
  return (
    <section className="bg-slate-950 py-24">

      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-5xl font-bold text-center text-white">
          AI Code Generation
        </h2>

        <p className="text-center text-gray-400 mt-5 text-lg">
          Describe your project and let AI SENSE generate Arduino code instantly.
        </p>

        <div className="mt-16 bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">

          {/* Header */}
          <div className="bg-slate-800 px-8 py-5 flex items-center gap-3">

            <Bot className="text-blue-500" size={35} />

            <div>

              <h3 className="text-2xl font-bold text-white">
                AI Assistant
              </h3>

              <p className="text-green-400 text-sm">
                ● Online
              </p>

            </div>

          </div>

          {/* User Message */}

          <div className="p-8">

            <div className="flex gap-4">

              <div className="bg-blue-600 p-3 rounded-full">
                <User />
              </div>

              <div className="bg-blue-600 rounded-2xl p-5 text-white">

                Generate Arduino UNO LED Blink program.

              </div>

            </div>

            {/* AI Reply */}

            <div className="flex gap-4 mt-10">

              <div className="bg-slate-700 p-3 rounded-full">
                <Bot />
              </div>

              <div className="bg-slate-800 rounded-2xl p-6 w-full">

                <p className="text-gray-300 mb-5">
                  Here's the Arduino UNO program:
                </p>

<pre className="bg-slate-950 rounded-xl p-5 text-green-400 overflow-x-auto">
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

                <div className="flex gap-4 mt-6">

                  <button className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl flex items-center gap-2">

                    <Copy size={18} />

                    Copy Code

                  </button>

                  <button className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl flex items-center gap-2">

                    <PlayCircle size={18} />

                    Open RUN Studio

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}