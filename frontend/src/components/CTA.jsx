import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="bg-blue-600 py-24">

      <div className="max-w-6xl mx-auto text-center px-8">

        <h2 className="text-5xl font-bold text-white">
          Ready to Build Your Arduino Project?
        </h2>

        <p className="text-blue-100 text-xl mt-6">
          Start generating Arduino code with AI in seconds.
        </p>

        <div className="flex justify-center gap-6 mt-10">

          <Link to="/register">
            <button className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-100">
              Get Started
            </button>
          </Link>

          <Link to="/login">
            <button className="border border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-700">
              Login
            </button>
          </Link>

        </div>

      </div>

    </section>
  );
}