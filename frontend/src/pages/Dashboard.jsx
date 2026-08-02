import {
  Home,
  MessageSquare,
  Cpu,
  BookOpen,
  Terminal,
  Folder,
  Settings,
  LogOut,
  Bell,
  Search,
  User,
  Plus,
  Upload,
  Play,
  Bot,
  Activity,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* Sidebar */}

      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between">

        <div>

          <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-500">
              AI SENSE
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              Arduino Development Platform
            </p>
          </div>

          <nav className="mt-8">

            <Menu
              icon={<Home />}
              text="Dashboard"
              active
              onClick={() => navigate("/dashboard")}
            />

            <Menu
              icon={<MessageSquare />}
              text="AI Chat"
              onClick={() => navigate("/chat")}
            />

            <Menu
              icon={<Cpu />}
              text="Module Library"
              onClick={() => navigate("/modules")}
            />

            <Menu
              icon={<FlaskConical />}
              text="Sensor Lab"
              onClick={() => navigate("/sensors")}
            />

            <Menu
              icon={<ShieldCheck />}
              text="QC Diagnostics"
              onClick={() => navigate("/qc")}
            />

            <Menu
              icon={<Terminal />}
              text="RUN Studio"
              onClick={() => navigate("/run")}
            />

            <Menu
              icon={<BookOpen />}
              text="Documentation"
              onClick={() => navigate("/documentation")}
            />

            <Menu
              icon={<Folder />}
              text="Projects"
              onClick={() => navigate("/projects")}
            />

            <Menu
              icon={<Settings />}
              text="Settings"
            />

          </nav>

        </div>

        <div className="p-6">

          <button
            onClick={logout}
            className="flex items-center gap-3 text-red-400 hover:text-red-300"
          >
            <LogOut />
            Logout
          </button>

        </div>

      </aside>

      {/* Main */}

      <main className="flex-1">

        {/* Top */}

        <div className="flex justify-between items-center p-6 border-b border-slate-800">

          <div className="flex items-center bg-slate-900 px-5 py-3 rounded-xl w-96">

            <Search size={20} className="text-gray-400" />

            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none ml-3 w-full"
            />

          </div>

          <div className="flex items-center gap-6">

            <Bell className="cursor-pointer" />

            <div className="flex items-center gap-3">

              <User
                className="bg-blue-600 rounded-full p-2"
                size={40}
              />

              <div>

                <h3 className="font-bold">
                  Gurunathan
                </h3>

                <p className="text-sm text-gray-400">
                  Developer
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Body */}

        <div className="p-8">

          <div className="bg-gradient-to-r from-blue-700 to-cyan-600 rounded-3xl p-8">

            <h2 className="text-4xl font-bold">
              Welcome Back 👋
            </h2>

            <p className="mt-4 text-lg">
              Continue building your Arduino UNO projects using AI.
            </p>

          </div>

          {/* Cards */}

          <div className="grid grid-cols-4 gap-6 mt-8">

            <Card
              title="Projects"
              value="12"
              color="text-blue-400"
            />

            <Card
              title="AI Chats"
              value="38"
              color="text-green-400"
            />

            <Card
              title="Modules"
              value="120+"
              color="text-yellow-400"
            />

            <Card
              title="Arduino"
              value="Ready"
              color="text-purple-400"
            />

          </div>

          {/* Quick Actions */}

          <h2 className="text-3xl font-bold mt-12">
            Quick Actions
          </h2>

          <div className="grid grid-cols-4 gap-6 mt-6">

            <Action
              icon={<Bot size={35} />}
              title="New AI Chat"
              onClick={() => navigate("/chat")}
            />

            <Action
              icon={<Plus size={35} />}
              title="New Project"
              onClick={() => navigate("/projects")}
            />

            <Action
              icon={<Upload size={35} />}
              title="Upload Code"
              onClick={() => navigate("/run")}
            />

            <Action
              icon={<Play size={35} />}
              title="RUN Studio"
              onClick={() => navigate("/run")}
            />

          </div>

          {/* Bottom */}

          <div className="grid grid-cols-2 gap-8 mt-10">

            <div className="bg-slate-900 rounded-3xl p-6">

              <h2 className="text-2xl font-bold">
                Recent Projects
              </h2>

              <Project
                name="LED Blink"
                onClick={() => navigate("/projects")}
              />

              <Project
                name="Servo Motor"
                onClick={() => navigate("/projects")}
              />

              <Project
                name="LCD Display"
                onClick={() => navigate("/projects")}
              />

              <Project
                name="Bluetooth Control"
                onClick={() => navigate("/projects")}
              />

            </div>

            <div className="bg-slate-900 rounded-3xl p-6">

              <h2 className="text-2xl font-bold">
                AI Status
              </h2>

              <div className="flex items-center gap-3 mt-8">

                <Activity className="text-green-400" />

                <span className="text-green-400">
                  Online
                </span>

              </div>

              <div className="mt-8">

                <p className="text-gray-400">
                  Arduino UNO
                </p>

                <div className="bg-green-600 rounded-full h-3 mt-2"></div>

              </div>

              <div className="mt-8">

                <p className="text-gray-400">
                  AI Engine
                </p>

                <div className="bg-blue-600 rounded-full h-3 mt-2"></div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

function Menu({ icon, text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 transition ${
        active
          ? "bg-blue-600 text-white"
          : "hover:bg-slate-800 text-gray-300"
      }`}
    >
      {icon}
      {text}
    </button>
  );
}

function Card({ title, value, color }) {
  return (
    <div className="bg-slate-900 rounded-3xl p-6">

      <h3 className="text-gray-400">
        {title}
      </h3>

      <h2 className={`text-4xl font-bold mt-4 ${color}`}>
        {value}
      </h2>

    </div>
  );
}

function Action({ icon, title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-slate-900 rounded-3xl p-8 hover:bg-blue-600 transition"
    >
      <div className="flex justify-center">
        {icon}
      </div>

      <h3 className="mt-5 text-xl">
        {title}
      </h3>

    </button>
  );
}

function Project({ name, onClick }) {
  return (
    <div className="flex justify-between items-center bg-slate-800 rounded-xl p-4 mt-4">

      <span>{name}</span>

      <button
        onClick={onClick}
        className="text-blue-400 hover:text-blue-300"
      >
        Open
      </button>

    </div>
  );
}