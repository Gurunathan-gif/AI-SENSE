import { Cpu } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-slate-950 text-white py-14">

      <div className="max-w-7xl mx-auto px-8">

        <div className="flex items-center gap-3 mb-6">

          <Cpu className="text-blue-500" size={34}/>

          <h2 className="text-3xl font-bold">
            AI <span className="text-blue-500">SENSE</span>
          </h2>

        </div>

        <p className="text-gray-400">
          Build Electronics with Artificial Intelligence.
        </p>

        <hr className="my-8 border-gray-700"/>

        <div className="flex justify-between flex-wrap gap-5">

          <p>
            © 2026 AI SENSE. All Rights Reserved.
          </p>

          <p>
            Version 1.0
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;