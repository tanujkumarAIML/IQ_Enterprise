import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import {
  RiDashboardLine, RiUserLine, RiVideoLine,
  RiBarChartLine, RiSettings4Line, RiShieldLine,
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

const navCls = ({ isActive }) =>
  `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${
    isActive ? "bg-violet-100 text-violet-700" : "text-slate-600 hover:bg-slate-100"
  }`;

const AdminPanel = () => (
  <DashboardLayout title="Admin Panel">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
          <RiShieldLine className="text-white text-lg" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
      </div>

      {/* Sub-navigation */}
      <div className="flex gap-1 flex-wrap mb-6 border-b border-slate-200 pb-3">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={navCls}>
            <Icon className="text-base" /> {label}
          </NavLink>
        ))}
      </div>

      {/* Sub-routes */}
      <Routes>
        <Route index                 element={<AdminDashboard />} />
        <Route path="users"          element={<AdminUsers />} />
        <Route path="interviews"     element={<AdminInterviews />} />
        <Route path="analytics"      element={<AdminAnalytics />} />
        <Route path="settings"       element={<AdminSettings />} />
      </Routes>
    </div>
  </DashboardLayout>
);

export default AdminPanel;
