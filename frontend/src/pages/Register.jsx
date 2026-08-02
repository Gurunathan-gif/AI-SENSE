import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Cpu } from "lucide-react";
import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await registerUser({
        name,
        email,
        password,
      });

      if (res.token) localStorage.setItem("token", res.token);
      if (res.user) localStorage.setItem("user", JSON.stringify(res.user));

      alert("Registration Successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(
        err.message ||
        err.response?.data?.message ||
          "Registration Failed"
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
            Join AI SENSE
          </h1>

          <p className="text-blue-100 text-xl mt-8 leading-9">
            Create your account and start developing
            Arduino UNO projects using Artificial Intelligence.
          </p>

        </div>

        {/* Right */}

        <div className="p-12">

          <h2 className="text-4xl font-bold text-white">
            Create Account
          </h2>

          <p className="text-gray-400 mt-3">
            Register to continue.
          </p>

          <form
            onSubmit={handleRegister}
            className="space-y-6 mt-10"
          >

            {/* Name */}

            <div>

              <label className="text-gray-300">
                Full Name
              </label>

              <div className="flex items-center bg-slate-800 rounded-xl px-4 mt-2">

                <User className="text-gray-400" />

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent p-4 outline-none text-white"
                />

              </div>

            </div>

            {/* Email */}

            <div>

              <label className="text-gray-300">
                Email
              </label>

              <div className="flex items-center bg-slate-800 rounded-xl px-4 mt-2">

                <Mail className="text-gray-400" />

                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent p-4 outline-none text-white"
                />

              </div>

            </div>

            {/* Confirm Password */}

            <div>

              <label className="text-gray-300">
                Confirm Password
              </label>

              <div className="flex items-center bg-slate-800 rounded-xl px-4 mt-2">

                <Lock className="text-gray-400" />

                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent p-4 outline-none text-white"
                />

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold transition"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

          </form>

          <p className="text-center text-gray-400 mt-8">

            Already have an account?

            <Link
              to="/login"
              className="text-blue-400 ml-2 hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}