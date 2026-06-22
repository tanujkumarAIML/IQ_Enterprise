import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiArrowLeftLine, RiBrainLine, RiHome2Line } from "react-icons/ri";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white text-center px-6">
      <div className="w-20 h-20 bg-violet-500/20 border border-violet-500/30 rounded-3xl flex items-center justify-center mb-6">
        <RiBrainLine className="text-5xl text-violet-400" />
      </div>
      <h1 className="text-9xl font-extrabold text-violet-500 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
        404
      </h1>
      <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
      <p className="text-slate-400 mb-8 max-w-md leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track!
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 border border-white/20 hover:bg-white/10 text-white font-semibold px-5 py-2.5 rounded-xl transition"
        >
          <RiArrowLeftLine /> Go Back
        </button>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-5 py-2.5 rounded-xl transition"
        >
          <RiHome2Line /> Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
