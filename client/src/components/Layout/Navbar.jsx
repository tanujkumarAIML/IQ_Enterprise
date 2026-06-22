import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth }  from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  RiMenuLine, RiSunLine, RiMoonLine,
  RiBellLine, RiUserLine, RiSearchLine,
} from "react-icons/ri";

const Navbar = ({ onMenuClick, title }) => {
  const { user }                 = useAuth();
  const { dark, toggleTheme }    = useTheme();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 md:px-6 h-16 bg-white border-b border-slate-100 shrink-0 z-10">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
          aria-label="Toggle sidebar"
        >
          <RiMenuLine className="text-xl" />
        </button>
        {title && (
          <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">
            {title}
          </h1>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
          title={dark ? "Light mode" : "Dark mode"}
        >
          {dark ? <RiSunLine className="text-xl" /> : <RiMoonLine className="text-xl" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition">
          <RiBellLine className="text-xl" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
        </button>

        {/* User Avatar */}
        <Link to="/profile" className="flex items-center gap-2 ml-1 group">
          {user?.avatar?.url ? (
            <img
              src={user.avatar.url}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-200 group-hover:ring-violet-400 transition"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-violet-200 group-hover:ring-violet-400 transition">
              {user?.name?.[0]?.toUpperCase() || <RiUserLine />}
            </div>
          )}
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-700 leading-none">{user?.name?.split(" ")[0]}</p>
            <p className="text-xs text-slate-400 capitalize leading-none mt-0.5">{user?.plan}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
