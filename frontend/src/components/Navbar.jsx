import { Link } from "react-router-dom";
import { Cpu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 z-50">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">

        {/* Logo */}

        <Link to="/" className="flex items-center gap-3">

          <Cpu size={38} className="text-blue-500" />

          <div>

            <h1 className="text-2xl font-bold text-white">
              AI SENSE
            </h1>

            <p className="text-xs text-gray-400">
              AI Powered Arduino Platform
            </p>

          </div>

        </Link>

        {/* Menu */}

        <div className="hidden md:flex items-center gap-8 text-gray-300">

          <Link to="/chat" className="hover:text-blue-400 transition">
            AI Code Studio
          </Link>

          <Link to="/sensors" className="hover:text-blue-400 transition">
            Sensor Lab
          </Link>

          <Link to="/qc" className="hover:text-blue-400 transition font-bold text-blue-400">
            QC Diagnostics
          </Link>

          <Link to="/modules" className="hover:text-blue-400 transition">
            Modules
          </Link>

          <Link to="/run" className="hover:text-blue-400 transition">
            Hardware Monitor
          </Link>

          <Link to="/documentation" className="hover:text-blue-400 transition">
            Docs
          </Link>

        </div>

        {/* Buttons */}

        <div className="flex gap-4">

          <Link to="/login">

            <button className="px-5 py-2 rounded-xl border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition">
              Login
            </button>

          </Link>

          <Link to="/register">

            <button className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition">
              Get Started
            </button>

          </Link>

        </div>

      </div>

    </nav>
  );
}