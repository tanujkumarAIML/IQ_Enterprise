import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  RiLockLine, RiDeleteBinLine, RiSunLine, RiMoonLine,
  RiShieldLine, RiNotificationLine, RiBrainLine,
} from "react-icons/ri";
import DashboardLayout from "../components/Layout/DashboardLayout";
import Button          from "../components/common/Button";
import { Input, Card } from "../components/common/index.jsx";
import { useAuth }     from "../context/AuthContext";
import { useTheme }    from "../context/ThemeContext";
import api             from "../services/api";

const Settings = () => {
  const { user, logout }       = useAuth();
  const { dark, toggleTheme }  = useTheme();
  const [saving, setSaving]    = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register, handleSubmit, watch,
    reset, formState: { errors },
  } = useForm();

  const onChangePassword = async ({ oldPassword, newPassword }) => {
    setSaving(true);
    try {
      await api.put("/profile/change-password", { oldPassword, newPassword });
      toast.success("Password changed successfully!");
      reset();
    } catch (err) {
      toast.error(err.message || "Password change failed");
    } finally { setSaving(false); }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "⚠️ This will permanently delete your account, all interviews, and resume data. Type DELETE to confirm."
    );
    if (!confirmed) return;
    toast.error("Please contact support@interviewiq.ai to delete your account.");
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-5">
        <h2 className="text-xl font-bold text-slate-800">Account Settings</h2>

        {/* Appearance */}
        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            {dark ? <RiMoonLine className="text-violet-500" /> : <RiSunLine className="text-yellow-500" />}
            Appearance
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Dark Mode</p>
              <p className="text-xs text-slate-400 mt-0.5">Toggle between light and dark theme</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                dark ? "bg-violet-600" : "bg-slate-200"
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                dark ? "translate-x-7" : "translate-x-1"
              }`} />
            </button>
          </div>
        </Card>

        {/* Account Info */}
        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <RiShieldLine className="text-violet-500" /> Account Information
          </h3>
          <div className="space-y-3 text-sm">
            {[
              ["Full Name",      user?.name],
              ["Email Address",  user?.email],
              ["Role",           user?.role],
              ["Plan",           user?.plan],
              ["Email Verified", user?.isEmailVerified ? "✅ Verified" : "❌ Not Verified"],
              ["Total Interviews", user?.totalInterviews || 0],
              ["Average Score",    `${user?.avgScore || 0}%`],
              ["Best Score",       `${user?.bestScore || 0}%`],
              ["Member Since",   user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric",
                  })
                : "—"],
            ].map(([label, value]) => (
              <div key={label}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-slate-500 font-medium">{label}</span>
                <span className="text-slate-700 font-semibold capitalize">{value ?? "—"}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Plan Info */}
        <Card className="p-6 bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-100">
          <div className="flex items-center gap-3 mb-3">
            <RiBrainLine className="text-violet-600 text-2xl" />
            <div>
              <p className="font-bold text-violet-800 capitalize">{user?.plan} Plan</p>
              <p className="text-xs text-violet-600">Current subscription</p>
            </div>
          </div>
          <div className="text-sm text-violet-700 space-y-1">
            {user?.plan === "free" ? (
              <>
                <p>✅ 5 mock interviews / month</p>
                <p>✅ Basic resume analysis</p>
                <p>✅ AI chatbot access</p>
                <p className="text-violet-400">🔒 Unlimited interviews — Upgrade to Pro</p>
              </>
            ) : (
              <>
                <p>✅ Unlimited mock interviews</p>
                <p>✅ Advanced resume analysis + cover letter</p>
                <p>✅ Full AI chatbot with history</p>
                <p>✅ Detailed PDF reports</p>
                <p>✅ Priority AI processing</p>
              </>
            )}
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <RiNotificationLine className="text-violet-500" /> Notifications
          </h3>
          {[
            { label: "Interview reminders",     desc: "Get reminded before scheduled interviews" },
            { label: "Weekly progress report",  desc: "Summary of your weekly performance" },
            { label: "AI tips & suggestions",   desc: "Personalized improvement suggestions" },
          ].map(({ label, desc }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-700">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
              <div className="w-10 h-5 bg-violet-500 rounded-full relative cursor-pointer">
                <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          ))}
        </Card>

        {/* Change Password */}
        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <RiLockLine className="text-violet-500" /> Change Password
          </h3>
          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              icon={<RiLockLine />}
              error={errors.oldPassword?.message}
              {...register("oldPassword", { required: "Current password is required" })}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Minimum 6 characters"
              icon={<RiLockLine />}
              error={errors.newPassword?.message}
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Repeat new password"
              icon={<RiLockLine />}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                validate: (v) => v === watch("newPassword") || "Passwords do not match",
              })}
            />
            <Button type="submit" loading={saving} icon={<RiLockLine />}>
              Update Password
            </Button>
          </form>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-100 bg-red-50">
          <h3 className="font-semibold text-red-600 mb-1 flex items-center gap-2">
            <RiDeleteBinLine /> Danger Zone
          </h3>
          <p className="text-sm text-red-500 mb-4">
            Deleting your account is irreversible. All interviews, reports, and resume data
            will be permanently removed.
          </p>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteAccount}
            loading={deleting}
          >
            Delete Account
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
