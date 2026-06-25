import React from "react";
import {
  RiSearchLine, RiFilter3Line, RiDownload2Line,
  RiCheckboxCircleLine, RiLoader4Line, RiTimeLine, RiUserLine,
} from "react-icons/ri";

/* ══════════════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════════════ */

const getStatusStyles = (status) => {
  switch (status) {
    case "Completed":
      return {
        bg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        dot: "bg-emerald-500",
        icon: RiCheckboxCircleLine,
      };
    case "In Progress":
      return {
        bg: "bg-amber-50 text-amber-700 border border-amber-200",
        dot: "bg-amber-500 animate-pulse",
        icon: RiLoader4Line,
      };
    case "Pending":
      return {
        bg: "bg-slate-50 text-slate-600 border border-slate-200",
        dot: "bg-slate-400",
        icon: RiTimeLine,
      };
    default:
      return {
        bg: "bg-slate-50 text-slate-600 border border-slate-200",
        dot: "bg-slate-400",
        icon: RiTimeLine,
      };
  }
};

const getScoreStyles = (score) => {
  if (score >= 85) return { ring: "border-emerald-200 bg-emerald-50 text-emerald-600" };
  if (score >= 70) return { ring: "border-amber-200 bg-amber-50 text-amber-600" };
  return { ring: "border-red-200 bg-red-50 text-red-600" };
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/* ══════════════════════════════════════════════════════════════════════
   MOCK DATA (Remove this and pass real data via props in production)
   ══════════════════════════════════════════════════════════════════════ */
const MOCK_DATA = [
  { _id: "1", user: { name: "Arjun Sharma", email: "arjun@email.com" }, jobRole: "SDE-2", company: "Amazon", overallScore: 92, status: "Completed", createdAt: "2023-10-24T10:00:00Z" },
  { _id: "2", user: { name: "Priya Nair", email: "priya@email.com" }, jobRole: "Frontend Dev", company: "Google", overallScore: 88, status: "Completed", createdAt: "2023-10-23T14:30:00Z" },
  { _id: "3", user: { name: "Rahul Verma", email: "rahul@email.com" }, jobRole: "ML Engineer", company: "Meta", overallScore: 45, status: "In Progress", createdAt: "2023-10-24T09:15:00Z" },
  { _id: "4", user: { name: "Sneha Patel", email: "sneha@email.com" }, jobRole: "Product Manager", company: "Microsoft", overallScore: 0, status: "Pending", createdAt: "2023-10-25T11:00:00Z" },
  { _id: "5", user: { name: "Alex Chen", email: "alex@email.com" }, jobRole: "Backend Dev", company: "Netflix", overallScore: 78, status: "Completed", createdAt: "2023-10-22T16:45:00Z" },
];

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════ */
const InterviewTable = ({ interviews = [] }) => {
  const tableData = interviews.length > 0 ? interviews : MOCK_DATA;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      
      {/* ── Top Toolbar ── */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Recent Interviews</h3>
          <p className="text-sm text-slate-400 mt-0.5">Monitor candidate progress and AI scoring.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-500 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 hover:text-slate-700 transition">
            <RiFilter3Line className="text-base" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-500 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 hover:text-slate-700 transition">
            <RiDownload2Line className="text-base" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/30">
        <div className="relative max-w-md">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            placeholder="Search by candidate, role, or company..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* ── Table Content ── */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Candidate
              </th>
              <th className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Role / Company
              </th>
              <th className="px-6 py-3.5 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3.5 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3.5 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100">
            {tableData.length === 0 ? (
              /* ── Empty State ── */
              <tr>
                <td colSpan="5" className="py-20">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                      <RiUserLine className="text-3xl text-slate-300" />
                    </div>
                    <p className="font-semibold text-slate-600 text-base">No Interviews Found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              tableData.map((item) => {
                const statusStyle = getStatusStyles(item.status);
                const scoreStyle = getScoreStyles(item.overallScore);
                const initials = (item.user?.name || "U")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();

                return (
                  <tr 
                    key={item._id} 
                    className="hover:bg-violet-50/30 transition-colors duration-150 group"
                  >
                    {/* Candidate Cell */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-violet-200 flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 text-sm truncate group-hover:text-violet-700 transition-colors">
                            {item.user?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {item.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role & Company Cell */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-700 text-sm">{item.jobRole}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.company || "-"}</p>
                    </td>

                    {/* Score Cell */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 ${scoreStyle.ring} font-bold text-sm">
                        {item.overallScore || 0}
                      </div>
                    </td>

                    {/* Status Cell */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyle.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        {item.status}
                      </span>
                    </td>

                    {/* Date Cell */}
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-slate-500 font-medium">
                        {formatDate(item.createdAt)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Bottom Footer / Pagination ── */}
      <div className="p-5 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-700">1 to {tableData.length}</span> of{" "}
          <span className="font-bold text-slate-700">{tableData.length}</span> results
        </p>
        
        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 text-sm font-medium text-slate-400 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            Prev
          </button>
          <button className="w-8 h-8 text-sm font-bold text-white bg-violet-600 rounded-lg shadow-sm shadow-violet-200">
            1
          </button>
          <button className="w-8 h-8 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            2
          </button>
          <button className="w-8 h-8 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            3
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            Next
          </button>
        </div>
      </div>

    </div>
  );
};

export default InterviewTable;