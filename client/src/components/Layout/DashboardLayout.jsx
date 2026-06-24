import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar  from "./Navbar";

const DashboardLayout = ({ children, title = "" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar
          onMenuClick={() => setSidebarOpen((o) => !o)}
          title={title}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
