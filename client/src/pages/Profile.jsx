import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  RiCameraLine, RiSaveLine, RiUserLine, RiLinkedinLine,
  RiGithubLine, RiGlobalLine, RiAddLine, RiCloseLine,
  RiStarFill, RiGraduationCapLine, RiStarFill,z
} from "react-icons/ri";
import DashboardLayout from "../components/Layout/DashboardLayout";
import Button          from "../components/common/Button";
import { Input, Card } from "../components/common/index.jsx";
import { useAuth }     from "../context/AuthContext";
import api             from "../services/api";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [saving, setSaving]  = useState(false);
  const [skills, setSkills]  = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileRef = useRef(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name:       user?.name       || "",
      phone:      user?.phone      || "",
      bio:        user?.bio        || "",
      location:   user?.location   || "",
      jobTitle:   user?.jobTitle   || "",
      company:    user?.company    || "",
      experience: user?.experience || 0,
      linkedin:   user?.linkedin   || "",
      github:     user?.github     || "",
      portfolio:  user?.portfolio  || "",
      website:    user?.website    || "",
    },
  });

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return; }
    setUploadingAvatar(true);
    try {
      const form = new FormData();
      form.append("avatar", file);
      const { data } = await api.post("/profile/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser({ avatar: data.avatar });
      toast.success("Avatar updated!");
    } catch { toast.error("Avatar upload failed"); }
    finally { setUploadingAvatar(false); }
  };

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const { data } = await api.put("/profile", { ...values, skills });
      updateUser(data.user);
      toast.success("Profile saved!");
    } catch { toast.error("Failed to save profile"); }
    finally { setSaving(false); }
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || skills.includes(s)) return;
    setSkills((prev) => [...prev, s]);
    setSkillInput("");
  };
  const removeSkill = (s) => setSkills((prev) => prev.filter((x) => x !== s));

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Avatar Card */}
          <Card className="p-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center ring-4 ring-violet-100">
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <RiUserLine className="text-5xl text-white/70" />
                  )}
                </div>
                <button type="button" onClick={() => fileRef.current.click()}
                  disabled={uploadingAvatar}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-violet-600 hover:bg-violet-700 text-white rounded-full flex items-center justify-center shadow-md transition disabled:opacity-60">
                  {uploadingAvatar
                    ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <RiCameraLine className="text-sm" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
                <p className="text-sm text-slate-400">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs bg-violet-100 text-violet-700 px-2.5 py-0.5 rounded-full font-semibold capitalize">{user?.plan} Plan</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-semibold capitalize">{user?.role}</span>
                  {user?.isEmailVerified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full font-semibold">✓ Verified</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Basic Info */}
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2"><RiUserLine /> Basic Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full Name *" error={errors.name?.message}
                {...register("name", { required: "Name is required" })} />
              <Input label="Phone" type="tel" placeholder="+91 98765 43210" {...register("phone")} />
              <Input label="Job Title" placeholder="Software Engineer" {...register("jobTitle")} />
              <Input label="Company" placeholder="Google, Startup, etc." {...register("company")} />
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Years of Experience</label>
                <select {...register("experience")}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-400 bg-white">
                  {[0,1,2,3,4,5,6,7,8,10,12,15,20].map((y) => (
                    <option key={y} value={y}>{y === 0 ? "Fresher (0 years)" : `${y}+ years`}</option>
                  ))}
                </select>
              </div>
              <Input label="Location" placeholder="Bangalore, India" {...register("location")} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Bio</label>
              <textarea {...register("bio")}
                placeholder="Write a short professional bio…"
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-slate-400" />
            </div>
          </Card>

          {/* Social Links */}
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2"><RiGlobalLine /> Social & Portfolio</h3>
            <Input label="LinkedIn" placeholder="https://linkedin.com/in/username" icon={<RiLinkedinLine />} {...register("linkedin")} />
            <Input label="GitHub"   placeholder="https://github.com/username"     icon={<RiGithubLine />}   {...register("github")} />
            <Input label="Portfolio" placeholder="https://yoursite.com"           icon={<RiGlobalLine />}   {...register("portfolio")} />
            <Input label="Website"  placeholder="https://blog.yoursite.com"       icon={<RiGlobalLine />}   {...register("website")} />
          </Card>

          {/* Skills */}
          <Card className="p-6">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><RiStarFill /> Skills</h3>
            <div className="flex gap-2 mb-4">
              <input value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                placeholder="e.g. React, Python, Docker…"
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-400" />
              <Button type="button" size="sm" onClick={addSkill} icon={<RiAddLine />}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.length === 0 ? (
                <p className="text-sm text-slate-400">No skills added yet. Add skills for personalized interview questions.</p>
              ) : skills.map((s) => (
                <span key={s} className="flex items-center gap-1.5 bg-violet-100 text-violet-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)} className="hover:text-red-500 transition">
                    <RiCloseLine className="text-xs" />
                  </button>
                </span>
              ))}
            </div>
            {skills.length > 0 && (
              <p className="text-xs text-violet-500 mt-3">
                ✨ These {skills.length} skills will be used to generate personalized interview questions!
              </p>
            )}
          </Card>

          {/* Stats */}
          <Card className="p-6">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><RiStarFill /> Interview Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Interviews",    value: user?.totalInterviews    || 0 },
                { label: "Average Score",        value: `${user?.avgScore       || 0}%` },
                { label: "Best Score",           value: `${user?.bestScore      || 0}%` },
              ].map(({ label, value }) => (
                <div key={label} className="text-center bg-violet-50 rounded-xl py-4">
                  <p className="text-2xl font-bold text-violet-700">{value}</p>
                  <p className="text-xs text-slate-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </Card>

          <Button type="submit" fullWidth size="lg" loading={saving} icon={<RiSaveLine />}>
            Save Profile
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
