import React from "react";
import {
  RiSearchLine, RiUserAddLine, RiAdminLine, 
  RiMoreLine, RiShieldStarLine, RiUserLine,
} from "react-icons/ri";

/* ══════════════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════════════ */

const getRoleStyles = (role) => {
  switch (role) {
    case "Admin":
      return {
        bg: "bg-violet-50 text-violet-700 border border-violet-200",
        icon: RiAdminLine,
      };
    case "Manager":
      return {
        bg: "bg-blue-50 text-blue-700 border border-blue-200",
        icon: RiShieldStarLine,
      };
    case "User":
    default:
      return {
        bg: "bg-slate-50 text-slate-600 border border-slate-200",
        icon: RiUserLine,
      };
  }
};

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/* ══════════════════════════════════════════════════════════════════════
   MOCK DATA (Remove this block and pass real data via props)
   ══════════════════════════════════════════════════════════════════════ */
const MOCK_USERS = [
  { _id: "1", name: "Arjun Sharma", email: "arjun.sharma@email.com", role: "Admin" },
  { _id: "2", name: "Priya Nair", email: "priya.nair@email.com", role: "User" },
  { _id: "3", name: "Rahul Verma", email: "rahul.verma@email.com", role: "Manager" },
  { _id: "4", name: "Sneha Patel", email: "sneha.p@email.com", role: "User" },
  { _id: "5", name: "Alex Chen", email: "alex.chen@email.com", role: "User" },
];

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════ */
const UserTable = ({ users = [] }) => {
  const tableData = users.length > 0 ? users : MOCK_USERS;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      
      {/* ── Top Toolbar ── */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">User Management</h3>
          <p className="text-sm text-slate-400 mt-0.5">Manage accounts, roles, and permissions.</p>
        </div>
        
        <button className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-200/50 transition-all hover:-translate-y-0.5">
          <RiUserAddLine className="text-lg" />
          Add New User
        </button>
      </div>

      {/* ── Search Bar ── */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/30">
        <div className="relative max-w-md">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* ── Table Content ── */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3.5 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3.5 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100">
            {tableData.length === 0 ? (
              /* ── Empty State ── */
              <tr>
                <td colSpan="4" className="py-20">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                      <RiUserLine className="text-3xl text-slate-300" />
                    </div>
                    <p className="font-semibold text-slate-600 text-base">No Users Found</p>
                    <p className="text-sm mt-1">Try adjusting your search or add a new user.</p>
                  </div>
                </td>
              </tr>
            ) : (
              tableData.map((user) => {
                const roleStyle = getRoleStyles(user.role);
                const RoleIcon = roleStyle.icon;
                const initials = getInitials(user.name);

                return (
                  <tr 
                    key={user._id} 
                    className="hover:bg-violet-50/30 transition-colors duration-150 group"
                  >
                    {/* User Cell (Avatar + Name) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-violet-200 flex-shrink-0">
                          {initials}
                        </div>
                        <p className="font-semibold text-slate-800 text-sm group-hover:text-violet-700 transition-colors truncate">
                          {user.name || "Unknown User"}
                        </p>
                      </div>
                    </td>

                    {/* Email Cell */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500 truncate block max-w-[250px]">
                        {user.email}
                      </span>
                    </td>

                    {/* Role Cell (Badge) */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${roleStyle.bg}`}>
                        <RoleIcon className="text-sm" />
                        {user.role}
                      </span>
                    </td>

                    {/* Actions Cell */}
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
                        <RiMoreLine className="text-lg" />
                      </button>
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
          <span className="font-bold text-slate-700">{tableData.length}</span> users
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
          <button className="px-3 py-1.5 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            Next
          </button>
        </div>
      </div>

    </div>
  );
};

export default UserTable;