import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Cpu } from "lucide-react";
import { loginUser } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser({
        email,
        password,
      });

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      alert("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-6">

      <div className="grid lg:grid-cols-2 bg-slate-900 rounded-3xl overflow-hidden shadow-2xl max-w-6xl w-full">

        {/* Left */}

        <div className="hidden lg:flex flex-col justify-center bg-blue-600 p-12">

          <Cpu size={80} className="text-white mb-6" />

          <h1 className="text-5xl font-bold text-white">
            AI SENSE
          </h1>

          <p className="text-blue-100 text-xl mt-8 leading-9">
            AI Powered Arduino Development Platform.
            Generate Arduino code, explore modules,
            save projects and upload directly to
            Arduino UNO.
          </p>

        </div>

        {/* Right */}

        <div className="p-12">

          <h2 className="text-4xl font-bold text-white">
            Login
          </h2>

          <p className="text-gray-400 mt-3">
            Welcome back to AI SENSE
          </p>

          <form
            onSubmit={handleLogin}
            className="space-y-6 mt-10"
          >

            {/* Email */}

            <div>

              <label className="text-gray-300">
                Email
              </label>

              <div className="flex items-center bg-slate-800 rounded-xl px-4 mt-2">

                <Mail className="text-gray-400" />

                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className="w-full bg-transparent p-4 outline-none text-white"
                />

              </div>

            </div>

            {/* Password */}

            <div>

              <label className="text-gray-300">
                Password
              </label>

              <div className="flex items-center bg-slate-800 rounded-xl px-4 mt-2">

                <Lock className="text-gray-400" />

                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  className="w-full bg-transparent p-4 outline-none text-white"
                />

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-4 font-bold transition"
            >
              {loading ? "Logging In..." : "Login"}
            </button>

          </form>

          <p className="text-center text-gray-400 mt-8">

            Don't have an account?

            <Link
              to="/register"
              className="text-blue-400 ml-2 hover:underline"
            >
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}