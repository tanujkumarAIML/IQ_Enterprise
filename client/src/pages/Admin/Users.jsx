import React, { useEffect, useState } from "react";
import { RiSearchLine, RiDeleteBinLine, RiShieldLine, RiUserLine, RiRefreshLine } from "react-icons/ri";
import toast from "react-hot-toast";
import api from "../../services/api";
import { Card, Loader, Badge } from "../../components/common/index.jsx";
import Button from "../../components/common/Button";

const AdminUsers = () => {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);
  const [updating, setUpdating] = useState(null);

  const load = async (p = 1, q = search) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/users?page=${p}&limit=15&search=${q}`);
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setPage(p);
    } catch { toast.error("Failed to load users"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Permanently delete this user and all their data?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((p) => p.filter((u) => u._id !== id));
      toast.success("User deleted.");
    } catch { toast.error("Delete failed."); }
  };

  const toggleRole = async (u) => {
    setUpdating(u._id);
    const newRole = ["admin","superadmin"].includes(u.role) ? "user" : "admin";
    try {
      await api.put(`/admin/users/${u._id}`, { role: newRole });
      setUsers((p) => p.map((x) => x._id === u._id ? { ...x, role: newRole } : x));
      toast.success(`Role updated → ${newRole}`);
    } catch { toast.error("Role update failed."); }
    finally { setUpdating(null); }
  };

  const toggleStatus = async (u) => {
    setUpdating(u._id);
    try {
      await api.put(`/admin/users/${u._id}`, { isActive: !u.isActive });
      setUsers((p) => p.map((x) => x._id === u._id ? { ...x, isActive: !u.isActive } : x));
      toast.success(`User ${u.isActive ? "deactivated" : "activated"}.`);
    } catch { toast.error("Status update failed."); }
    finally { setUpdating(null); }
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); load(1, e.target.value); }}
            placeholder="Search by name or email…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-violet-400 bg-white"
          />
        </div>
        <button onClick={() => load(1, search)} className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition">
          <RiRefreshLine className="text-lg" />
        </button>
        <span className="text-sm text-slate-400 whitespace-nowrap">{total} users</span>
      </div>

      <Card className="overflow-hidden">
        {loading ? <Loader /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  {["Name","Email","Role","Plan","Interviews","Status","Joined","Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-10 text-slate-400">No users found</td></tr>
                ) : users.map((u) => (
                  <tr key={u._id} className={`hover:bg-slate-50 transition ${!u.isActive ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {u.avatar?.url ? (
                          <img src={u.avatar.url} className="w-7 h-7 rounded-full object-cover" alt="" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-bold">{u.name?.[0]}</div>
                        )}
                        <span className="font-medium text-slate-700">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge color={["admin","superadmin"].includes(u.role) ? "violet" : "gray"}>{u.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={u.plan === "pro" ? "green" : u.plan === "enterprise" ? "blue" : "gray"}>{u.plan}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-center">{u.totalInterviews || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleRole(u)}
                          disabled={updating === u._id}
                          className="text-xs text-violet-600 hover:underline font-medium disabled:opacity-40"
                        >
                          {["admin","superadmin"].includes(u.role) ? "Demote" : "Make Admin"}
                        </button>
                        <span className="text-slate-300">·</span>
                        <button
                          onClick={() => toggleStatus(u)}
                          disabled={updating === u._id}
                          className={`text-xs font-medium hover:underline disabled:opacity-40 ${u.isActive ? "text-orange-500" : "text-green-600"}`}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <span className="text-slate-300">·</span>
                        <button onClick={() => deleteUser(u._id)} className="text-red-400 hover:text-red-600 transition">
                          <RiDeleteBinLine className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => load(p)}
              className={`w-8 h-8 rounded-lg text-sm font-semibold transition ${p === page ? "bg-violet-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-violet-50"}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
