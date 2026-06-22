import React from "react";
import { Card } from "../../components/common/index.jsx";
import { RiSettingsLine, RiShieldLine, RiMailLine, RiCloudLine, RiRobot2Line } from "react-icons/ri";

const CONFIG_ITEMS = [
  { icon: RiRobot2Line,   label: "AI Service",     value: "Gemini 2.0 Flash", status: "Active",      color: "green" },
  { icon: RiMailLine,     label: "Email Service",  value: "Gmail SMTP",       status: "Configured",  color: "green" },
  { icon: RiCloudLine,    label: "File Storage",   value: "Cloudinary",       status: "Connected",   color: "green" },
  { icon: RiShieldLine,   label: "Authentication", value: "JWT + Refresh",    status: "Secure",      color: "green" },
  { icon: RiSettingsLine, label: "Environment",    value: process.env.NODE_ENV || "development", status: "Set", color: "blue" },
];

const AdminSettings = () => (
  <div className="space-y-5 max-w-2xl">
    <Card className="p-6">
      <h3 className="font-semibold text-slate-700 mb-4">System Configuration</h3>
      <div className="space-y-3">
        {CONFIG_ITEMS.map(({ icon: Icon, label, value, status, color }) => (
          <div key={label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Icon className="text-violet-500 text-xl" />
              <div>
                <p className="text-sm font-semibold text-slate-700">{label}</p>
                <p className="text-xs text-slate-400">{value}</p>
              </div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${color === "green" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
              ● {status}
            </span>
          </div>
        ))}
      </div>
    </Card>

    <Card className="p-6">
      <h3 className="font-semibold text-slate-700 mb-4">API Configuration</h3>
      <div className="space-y-3 text-sm">
        {[
          ["Base URL",       window.location.origin],
          ["API Version",    "v3.0.0"],
          ["Rate Limit",     "500 req / 15 min"],
          ["File Size Limit","5 MB"],
          ["JWT Expiry",     "1 day (access) · 7 days (refresh)"],
          ["Session",        "HTTP-only cookies"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
            <span className="text-slate-500">{k}</span>
            <span className="text-slate-700 font-medium">{v}</span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

export default AdminSettings;
