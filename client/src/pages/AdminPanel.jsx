import React from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiDashboardLine, RiUserLine, RiVideoLine,
  RiBarChartLine, RiSettings4Line, RiShieldLine,
  RiTimeLine, RiNotification3Line,
} from "react-icons/ri";

import DashboardLayout from "../components/Layout/DashboardLayout";
import AdminDashboard  from "./Admin/Dashboard";
import AdminUsers      from "./Admin/Users";
import AdminInterviews from "./Admin/Interviews";
import AdminAnalytics  from "./Admin/Analytics";
import AdminSettings   from "./Admin/Settings";

const NAV = [
  { to: "/admin",             label: "Dashboard",  icon: RiDashboardLine, end: true },
  { to: "/admin/users",       label: "Users",      icon: RiUserLine },
  { to: "/admin/interviews",  label: "Interviews", icon: RiVideoLine },
  { to: "/admin/analytics",   label: "Analytics",  icon: RiBarChartLine },
  { to: "/admin/settings",    label: "Settings",   icon: RiSettings4Line },
];

// Modern Pill-style Navigation Class
const navCls = ({ isActive }) =>
  `relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
    isActive
      ? "bg-violet-600 text-white shadow-lg shadow-violet-200/50"
      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
  }`;

// Smooth page transition wrapper for routes
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
    className="w-full"
  >
    {children}
  </motion.div>
);

const AdminPanel = () => {
  const location = useLocation();
  const currentDate = new Date().toLocaleDateString("en-US", { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <DashboardLayout title="Admin Panel">
      <div className="max-w-7xl mx-auto">
        
        {/* ── Premium Header Card ── */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
                <RiShieldLine className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
                <p className="text-sm text-slate-400 font-medium">Manage your platform, users, and analytics.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-500 md:mt-0 mt-2">
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                <RiTimeLine className="text-violet-500 text-lg" />
                <span className="font-medium text-slate-600 hidden sm:inline">{currentDate}</span>
              </div>
              <button className="relative p-2.5 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition">
                <RiNotification3Line className="text-lg text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Segmented Sub-Navigation ── */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-2 mb-6 shadow-sm inline-flex gap-1 flex-wrap">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink 
              key={to} 
              to={to} 
              end={end} 
              className={navCls}
            >
              <Icon className="text-lg" /> 
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </div>

        {/* ── Animated Route Content ── */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm min-h-[60vh]">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route index                 element={<PageTransition><AdminDashboard /></PageTransition>} />
              <Route path="users"          element={<PageTransition><AdminUsers /></PageTransition>} />
              <Route path="interviews"     element={<PageTransition><AdminInterviews /></PageTransition>} />
              <Route path="analytics"      element={<PageTransition><AdminAnalytics /></PageTransition>} />
              <Route path="settings"       element={<PageTransition><AdminSettings /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminPanel;