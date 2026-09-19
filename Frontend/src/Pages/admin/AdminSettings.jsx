import { useState } from "react";
import { KeyRound, Mail, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { API } from "../../utils/api";

const AdminSettings = () => {
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userData?.id;

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [emailForm, setEmailForm] = useState({
    currentPassword: "",
    newEmail: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    emailCurrent: false,
  });

  const [passwordStatus, setPasswordStatus] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const toggle = (field) =>
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ success: false, message: "New passwords do not match." });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordStatus({ success: false, message: "New password must be at least 8 characters." });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/change-credentials`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken") || localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      setPasswordStatus({ success: data.success, message: data.message });
      if (data.success) {
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch {
      setPasswordStatus({ success: false, message: "Something went wrong. Please try again." });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setEmailStatus(null);

    if (!emailForm.newEmail || !emailForm.currentPassword) {
      setEmailStatus({ success: false, message: "All fields are required." });
      return;
    }

    setEmailLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/change-credentials`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken") || localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId,
          currentPassword: emailForm.currentPassword,
          newEmail: emailForm.newEmail,
        }),
      });
      const data = await res.json();
      setEmailStatus({ success: data.success, message: data.message });
      if (data.success) {
        setEmailForm({ currentPassword: "", newEmail: "" });
      }
    } catch {
      setEmailStatus({ success: false, message: "Something went wrong. Please try again." });
    } finally {
      setEmailLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C1625]/30 focus:border-[#7C1625] transition-all bg-slate-50";

  const StatusMessage = ({ status }) =>
    status ? (
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
          status.success
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}
      >
        {status.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
        {status.message}
      </div>
    ) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your admin login credentials.</p>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C1625]/10 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-[#7C1625]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Change Password</h3>
            <p className="text-xs text-slate-500">Use a strong password with 8+ characters.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Current Password</label>
            <input
              type={showPasswords.current ? "text" : "password"}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
              className={inputClass}
              placeholder="Enter current password"
              required
            />
            <button type="button" onClick={() => toggle("current")} className="absolute right-3 top-8 text-slate-400 hover:text-slate-600">
              {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">New Password</label>
            <input
              type={showPasswords.new ? "text" : "password"}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
              className={inputClass}
              placeholder="Enter new password"
              required
            />
            <button type="button" onClick={() => toggle("new")} className="absolute right-3 top-8 text-slate-400 hover:text-slate-600">
              {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirm New Password</label>
            <input
              type={showPasswords.confirm ? "text" : "password"}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
              className={inputClass}
              placeholder="Confirm new password"
              required
            />
            <button type="button" onClick={() => toggle("confirm")} className="absolute right-3 top-8 text-slate-400 hover:text-slate-600">
              {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <StatusMessage status={passwordStatus} />

          <button
            type="submit"
            disabled={passwordLoading}
            className="w-full py-2.5 bg-[#7C1625] text-white text-sm font-bold rounded-xl hover:bg-[#6a1220] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Change Email */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C1625]/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-[#7C1625]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Change Email</h3>
            <p className="text-xs text-slate-500">Update your admin login email address.</p>
          </div>
        </div>

        <form onSubmit={handleEmailChange} className="space-y-4">
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Current Password</label>
            <input
              type={showPasswords.emailCurrent ? "text" : "password"}
              value={emailForm.currentPassword}
              onChange={(e) => setEmailForm((p) => ({ ...p, currentPassword: e.target.value }))}
              className={inputClass}
              placeholder="Enter current password to confirm"
              required
            />
            <button type="button" onClick={() => toggle("emailCurrent")} className="absolute right-3 top-8 text-slate-400 hover:text-slate-600">
              {showPasswords.emailCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">New Email Address</label>
            <input
              type="email"
              value={emailForm.newEmail}
              onChange={(e) => setEmailForm((p) => ({ ...p, newEmail: e.target.value }))}
              className={inputClass}
              placeholder="Enter new email address"
              required
            />
          </div>

          <StatusMessage status={emailStatus} />

          <button
            type="submit"
            disabled={emailLoading}
            className="w-full py-2.5 bg-[#7C1625] text-white text-sm font-bold rounded-xl hover:bg-[#6a1220] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {emailLoading ? "Updating..." : "Update Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
