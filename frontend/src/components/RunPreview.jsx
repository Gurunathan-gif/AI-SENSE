import { motion } from "framer-motion";
import {
  Play,
  Upload,
  Cpu,
  Usb,
  CheckCircle,
  Terminal
} from "lucide-react";

export default function RunPreview() {
  return (
    <section className="bg-slate-100 py-24">

      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-5xl font-bold text-center">
          Arduino RUN Studio
        </h2>

        <p className="text-center text-gray-500 mt-4 mb-16">
          Compile and Upload Arduino Code directly from AI SENSE.
        </p>

        <motion.div
          initial={{opacity:0,y:50}}
          whileInView={{opacity:1,y:0}}
          transition={{duration:0.8}}
          className="rounded-3xl overflow-hidden shadow-2xl"
        >

          {/* Top Bar */}

          <div className="bg-slate-900 text-white p-4 flex justify-between">

            <div className="flex gap-6">

              <div className="flex items-center gap-2">

                <Cpu size={18}/>

                Arduino UNO Q

              </div>

              <div className="flex items-center gap-2">

                <Usb size={18}/>

                COM3

              </div>

            </div>

            <div className="flex gap-3">

              <button className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">

                <Play size={18}/>

                Compile

              </button>

              <button className="bg-green-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">

                <Upload size={18}/>

                Upload

              </button>

            </div>

          </div>

          {/* Code */}

          <div className="bg-black text-green-400 p-6 font-mono text-sm overflow-auto">

{`#include <Servo.h>

Servo servo;

void setup(){

  servo.attach(9);

}

void loop(){

  servo.write(90);

  delay(1000);

}`}

          </div>

          {/* Console */}

          <div className="bg-slate-900 text-white p-5">

            <div className="flex items-center gap-2 mb-3">

              <Terminal size={18}/>

              Console

            </div>

            <div className="text-green-400 flex items-center gap-2">

              <CheckCircle size={18}/>

              Compilation Successful ✔

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}