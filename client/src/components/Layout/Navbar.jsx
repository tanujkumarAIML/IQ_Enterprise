import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  RiMenuLine,
  RiSunLine,
  RiMoonLine,
  RiBellLine,
  RiUserLine,
} from "react-icons/ri";

const Navbar = ({ onMenuClick, title }) => {
  const { user } = useAuth();
  const { dark, toggleTheme } = useTheme();

  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <RiMenuLine className="text-2xl" />
        </button>

        {title && (
          <h1 className="hidden sm:block text-xl font-bold text-slate-800 dark:text-white">
            {title}
          </h1>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Theme Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={dark ? "Light Mode" : "Dark Mode"}
        >
          {dark ? (
            <RiSunLine className="text-xl text-yellow-400" />
          ) : (
            <RiMoonLine className="text-xl" />
          )}
        </button>

        {/* Notification */}
        <button className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <RiBellLine className="text-xl" />

          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-violet-500"></span>
        </button>

        {/* User */}
        <Link
          to="/profile"
          className="flex items-center gap-3 ml-2"
        >
          {user?.avatar?.url ? (
            <img
              src={user.avatar.url}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-300"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold ring-2 ring-violet-300">
              {user?.name?.charAt(0)?.toUpperCase() || (
                <RiUserLine />
              )}
            </div>
          )}

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-800 dark:text-white leading-none">
              {user?.name}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-1">
              {user?.plan} Plan
            </p>
          </div>
        </Link>

      </div>
    </header>
  );
};

export default Navbar;