import React, { useEffect, useState } from "react";
import { RiSearchLine, RiVideoLine } from "react-icons/ri";
import toast from "react-hot-toast";
import api from "../../services/api";
import { Card, Loader, Badge } from "../../components/common/index.jsx";

const scoreColor = (s) => s >= 75 ? "text-green-600" : s >= 55 ? "text-yellow-600" : "text-red-500";

const AdminInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");

  useEffect(() => {
    api.get("/admin/dashboard")
      .then(({ data }) => setInterviews(data.dashboard?.recentInterviews || []))
      .catch(() => toast.error("Failed to load interviews"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = interviews.filter((iv) =>
    iv.jobRole?.toLowerCase().includes(search.toLowerCase()) ||
    iv.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by role or user…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-violet-400 bg-white"
        />
      </div>

      <Card className="overflow-hidden">
        {loading ? <Loader /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>{["User","Job Role","Type","Difficulty","Score","Status","Date"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10 text-slate-400">
                    <RiVideoLine className="text-4xl mx-auto mb-2 text-slate-300" />
                    No interviews found
                  </td></tr>
                ) : filtered.map((iv) => (
                  <tr key={iv._id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-slate-600">{iv.user?.name || "—"}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{iv.jobRole}</td>
                    <td className="px-4 py-3 text-slate-500">{iv.interviewType}</td>
                    <td className="px-4 py-3"><Badge color={iv.difficulty === "Hard" ? "red" : iv.difficulty === "Medium" ? "yellow" : "green"}>{iv.difficulty}</Badge></td>
                    <td className="px-4 py-3 font-bold text-lg"><span className={scoreColor(iv.overallScore)}>{iv.overallScore}%</span></td>
                    <td className="px-4 py-3"><Badge color={iv.status === "Completed" ? "green" : "violet"}>{iv.status}</Badge></td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{new Date(iv.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminInterviews;
