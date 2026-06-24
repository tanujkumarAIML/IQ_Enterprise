import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  RiDashboardLine,
  RiUserLine,
  RiFileTextLine,
  RiVideoLine,
  RiHistoryLine,
  RiRobot2Line,
  RiSettings4Line,
  RiLogoutBoxLine,
  RiShieldLine,
  RiBrainLine,
} from "react-icons/ri";

const NAV = [
  { to: "/dashboard", icon: RiDashboardLine, label: "Dashboard" },
  { to: "/interview", icon: RiVideoLine, label: "Mock Interview" },
  { to: "/history", icon: RiHistoryLine, label: "My History" },
  { to: "/resume", icon: RiFileTextLine, label: "Resume Analyzer" },
  { to: "/chatbot", icon: RiRobot2Line, label: "AI Chatbot" },
  { to: "/profile", icon: RiUserLine, label: "Profile" },
  { to: "/settings", icon: RiSettings4Line, label: "Settings" },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-violet-600 text-white shadow-md shadow-violet-300"
      : "text-slate-600 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-slate-800 hover:text-violet-700 dark:hover:text-violet-400"
  }`;

const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-30 flex flex-col w-64
      bg-white dark:bg-slate-900
      border-r border-slate-200 dark:border-slate-800
      shadow-sm
      transition-transform duration-300
      ${
        open
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <RiBrainLine className="text-white text-xl" />
        </div>

        <div>
          <h2
            className="font-bold text-lg text-slate-800 dark:text-white"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            InterviewIQ
          </h2>
        </div>
      </div>

      {/* User */}
      <div className="px-4 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {user?.avatar?.url ? (
            <img
              src={user.avatar.url}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-violet-300"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate text-slate-800 dark:text-white">
              {user?.name}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize truncate">
              {user?.plan} Plan • {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={linkClass}
            onClick={onClose}
          >
            <Icon className="text-lg shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Admin Panel */}
        {(user?.role === "admin" ||
          user?.role === "superadmin") && (
          <NavLink
            to="/admin"
            className={linkClass}
            onClick={onClose}
          >
            <RiShieldLine className="text-lg shrink-0" />
            <span>Admin Panel</span>
          </NavLink>
        )}
      </nav>

      {/* Plan */}
      <div className="mx-3 mb-3 rounded-xl border border-violet-100 dark:border-slate-700 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 p-3">
        <p className="text-xs font-bold text-violet-600 uppercase">
          {user?.plan || "FREE"} PLAN
        </p>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {user?.plan === "free"
            ? "Upgrade for unlimited interviews."
            : "All premium features enabled."}
        </p>
      </div>

      {/* Logout */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition-all"
        >
          <RiLogoutBoxLine className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;