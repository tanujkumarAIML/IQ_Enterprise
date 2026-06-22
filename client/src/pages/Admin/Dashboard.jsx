import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from "recharts";
import { RiUserLine, RiVideoLine, RiFileTextLine, RiTrophyLine } from "react-icons/ri";
import toast from "react-hot-toast";
import api from "../../services/api";
import { Card, Loader } from "../../components/common/index.jsx";

const COLORS = ["#7c3aed","#4f46e5","#0ea5e9","#16a34a","#d97706"];

const StatBox = ({ label, value, icon: Icon, color }) => {
  const cls = { violet:"bg-violet-50 text-violet-700", blue:"bg-blue-50 text-blue-700", green:"bg-green-50 text-green-700", orange:"bg-orange-50 text-orange-700" };
  return (
    <div className={`${cls[color]||cls.violet} rounded-2xl p-5 flex items-start justify-between`}>
      <div>
        <p className="text-sm font-medium opacity-70">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className="p-3 bg-white/60 rounded-xl"><Icon className="text-2xl" /></div>
    </div>
  );
};

const AdminDashboard = () => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then(({ data }) => setData(data.dashboard))
      .catch(() => toast.error("Failed to load admin data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading admin dashboard…" />;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox label="Total Users"      value={data?.stats?.totalUsers || 0}      icon={RiUserLine}    color="violet" />
        <StatBox label="Total Interviews" value={data?.stats?.totalInterviews || 0} icon={RiVideoLine}   color="blue"   />
        <StatBox label="Total Resumes"    value={data?.stats?.totalResumes || 0}    icon={RiFileTextLine} color="green"  />
        <StatBox label="Completed"        value={data?.stats?.completedInterviews || 0} icon={RiTrophyLine} color="orange" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Monthly Signups (Last 6 months)</h3>
          {(data?.monthlySignups || []).length === 0
            ? <p className="text-slate-400 text-sm text-center py-8">No signup data yet</p>
            : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.monthlySignups}>
                  <XAxis dataKey="_id.month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6,6,0,0]}>
                    {(data.monthlySignups).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Recent Users</h3>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {(data?.recentUsers || []).map((u) => (
              <div key={u._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{u.name}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${u.role === "admin" ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600"}`}>{u.role}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${u.plan === "pro" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>{u.plan}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent interviews */}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-700 mb-4">Recent Interviews</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>{["User","Role","Type","Score","Status","Date"].map(h => <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(data?.recentInterviews || []).map((iv) => (
                <tr key={iv._id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 text-slate-600">{iv.user?.name || "—"}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{iv.jobRole}</td>
                  <td className="px-4 py-3 text-slate-500">{iv.interviewType}</td>
                  <td className="px-4 py-3 font-bold" style={{ color: iv.overallScore >= 75 ? "#16a34a" : iv.overallScore >= 55 ? "#d97706" : "#dc2626" }}>{iv.overallScore}%</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${iv.status === "Completed" ? "bg-green-100 text-green-700" : "bg-violet-100 text-violet-700"}`}>{iv.status}</span></td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{new Date(iv.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
