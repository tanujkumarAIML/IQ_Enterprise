import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  RiDashboardLine, RiUserLine, RiFileTextLine, RiVideoLine,
  RiHistoryLine, RiRobot2Line, RiSettings4Line, RiLogoutBoxLine,
  RiShieldLine, RiBrainLine, RiBarChartLine,
} from "react-icons/ri";

const NAV = [
  { to: "/dashboard", icon: RiDashboardLine, label: "Dashboard" },
  { to: "/interview",  icon: RiVideoLine,     label: "Mock Interview" },
  { to: "/history",    icon: RiHistoryLine,   label: "My History" },
  { to: "/resume",     icon: RiFileTextLine,  label: "Resume Analyzer" },
  { to: "/chatbot",    icon: RiRobot2Line,    label: "AI Chatbot" },
  { to: "/profile",    icon: RiUserLine,      label: "Profile" },
  { to: "/settings",   icon: RiSettings4Line, label: "Settings" },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-violet-600 text-white shadow-md shadow-violet-200"
      : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
  }`;

const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-30 flex flex-col w-64 bg-white border-r border-slate-100 shadow-sm transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <RiBrainLine className="text-white text-lg" />
        </div>
        <span className="font-bold text-lg text-slate-800" style={{ fontFamily: "Poppins, sans-serif" }}>
          InterviewIQ
        </span>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-200" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full ring-1 ring-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize truncate">{user?.plan} Plan · {user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={linkClass} onClick={onClose}>
            <Icon className="text-lg shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Admin-only link */}
        {["admin","superadmin"].includes(user?.role) && (
          <NavLink to="/admin" className={linkClass} onClick={onClose}>
            <RiShieldLine className="text-lg shrink-0" />
            <span>Admin Panel</span>
          </NavLink>
        )}
      </nav>

      {/* Plan badge */}
      <div className="px-4 py-2 mx-3 mb-2 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100">
        <p className="text-xs text-violet-600 font-semibold">{user?.plan?.toUpperCase()} PLAN</p>
        <p className="text-xs text-slate-400 mt-0.5">
          {user?.plan === "free" ? "Upgrade for unlimited interviews" : "Full access enabled"}
        </p>
      </div>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">
          <RiLogoutBoxLine className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
