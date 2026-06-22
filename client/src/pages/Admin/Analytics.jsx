import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import toast from "react-hot-toast";
import api from "../../services/api";
import { Card, Loader } from "../../components/common/index.jsx";

const COLORS = ["#7c3aed","#4f46e5","#0ea5e9","#16a34a","#d97706","#dc2626"];

const AdminAnalytics = () => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/analytics")
      .then(({ data }) => setData(data.analytics))
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading analytics…" />;

  const planData = (data?.planBreakdown || []).map((p) => ({ name: p._id, value: p.count }));

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: data?.totalUsers || 0 },
          { label: "Completed Interviews", value: data?.totalInterviews || 0 },
          { label: "Platform Avg Score", value: `${data?.avgScore || 0}%` },
        ].map(({ label, value }) => (
          <Card key={label} className="p-5 text-center">
            <p className="text-3xl font-bold text-violet-700">{value}</p>
            <p className="text-sm text-slate-400 mt-1">{label}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Plan Breakdown */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-700 mb-4">User Plan Distribution</h3>
          {planData.length === 0 ? <p className="text-center text-slate-400 py-8">No data</p> : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={planData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {planData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {planData.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-1 text-xs text-slate-600">
                    <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    {p.name} ({p.value})
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Platform Health */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Platform Health</h3>
          <div className="space-y-3">
            {[
              { label: "API Status",        value: "Healthy",  color: "text-green-600" },
              { label: "AI Service",        value: "Online",   color: "text-green-600" },
              { label: "Database",          value: "Connected",color: "text-green-600" },
              { label: "Email Service",     value: "Active",   color: "text-green-600" },
              { label: "Storage (Cloudinary)", value: "Active",color: "text-green-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-500">{label}</span>
                <span className={`text-sm font-semibold ${color} flex items-center gap-1`}>
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                  {value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
