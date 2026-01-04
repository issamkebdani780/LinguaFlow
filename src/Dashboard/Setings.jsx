import { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient";
import { User, Bell, Save, Eye, EyeOff, Mail, Lock } from "lucide-react";

const Settings = ({ session }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    dailyReminders: true,
    weeklyReports: false,
    achievementAlerts: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user settings
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchUserSettings = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        
        setEmail(authData?.user?.email || "");
        setUsername(authData?.user?.user_metadata?.username || "");
        
        const savedNotifications = authData?.user?.user_metadata?.notifications;
        if (savedNotifications) setNotifications(savedNotifications);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching settings:", error);
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, [session?.user?.id]);

  // Save Username (in user_metadata)
  const handleSaveUsername = async () => {
    if (!username.trim()) {
      alert("Username cannot be empty!");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { username: username.trim() }
      });

      if (error) throw error;
      alert("Username updated successfully!");
    } catch (error) {
      console.error("Error updating username:", error);
      alert("Failed to update username: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Change Email
  const handleChangeEmail = async () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address!");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: email });
      if (error) throw error;
      alert("Confirmation email sent! Please check your inbox.");
    } catch (error) {
      console.error("Error updating email:", error);
      alert("Failed to update email: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Change Password
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters!");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      alert("Password changed successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Save Notifications
  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { notifications: notifications },
      });

      if (error) throw error;
      alert("Notification preferences saved!");
    } catch (error) {
      console.error("Error saving notifications:", error);
      alert("Failed to save notifications: " + error.message);
    } finally {
      setSaving(false);
    }
  };



  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Username */}
      <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Username</h2>
            <p className="text-sm text-gray-400">Update your display name</p>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#0B0C10]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
            placeholder="Enter username"
          />
          <button
            onClick={handleSaveUsername}
            disabled={saving}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "Saving..." : "Save Username"}
          </button>
        </div>
      </div>

      {/* Email */}
      <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Mail className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Email Address</h2>
            <p className="text-sm text-gray-400">Change your email</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0B0C10]/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
              placeholder="Enter email"
            />
          </div>
          <p className="text-xs text-gray-500">
            ⚠️ You'll need to verify the new email address
          </p>
          <button
            onClick={handleChangeEmail}
            disabled={saving}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "Sending..." : "Change Email"}
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Lock className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Change Password</h2>
            <p className="text-sm text-gray-400">Update your password</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#0B0C10]/50 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
              placeholder="New password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#0B0C10]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
            placeholder="Confirm password"
          />
          <button
            onClick={handleChangePassword}
            disabled={saving || !newPassword || !confirmPassword}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Lock className="w-5 h-5" />
            {saving ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Notifications</h2>
            <p className="text-sm text-gray-400">Manage notifications</p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries({
            emailNotifications: "Email Notifications",
            dailyReminders: "Daily Reminders",
            weeklyReports: "Weekly Reports",
            achievementAlerts: "Achievement Alerts"
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <p className="text-white font-medium text-sm">{label}</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[key]}
                  onChange={(e) =>
                    setNotifications({ ...notifications, [key]: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
            </div>
          ))}
          <button
            onClick={handleSaveNotifications}
            disabled={saving}
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;