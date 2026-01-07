// src/components/Settings.jsx
import { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient";
import {
  User,
  Bell,
  Save,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Settings as SettingsIcon,
  Shield,
  Sparkles,
  Check,
  BarChart3,
} from "lucide-react";
import { UserAuth } from "../Authcontex";

const Settings = () => {
  const { session } = UserAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    dailyReminders: true,
    weeklyReports: false,
    achievementAlerts: true,
  });

  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);

      const accessToken = hashParams.get("access_token");
      const tokenHash = queryParams.get("token_hash");
      const type = queryParams.get("type");

      if (accessToken && hashParams.get("type") === "email_change") {
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get("refresh_token"),
          });

          if (error) throw error;

          alert("Email successfully changed!");
          window.history.replaceState({}, document.title, window.location.pathname);
          window.location.reload();
        } catch (error) {
          console.error("Error:", error);
          alert("Failed to confirm email change: " + error.message);
        }
      }

      if (tokenHash && type === "email_change") {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "email_change",
          });

          if (error) throw error;

          alert("Email successfully changed!");
          window.history.replaceState({}, document.title, window.location.pathname);
          window.location.reload();
        } catch (error) {
          console.error("Error:", error);
          alert("Failed to confirm email change: " + error.message);
        }
      }
    };

    handleEmailConfirmation();
  }, []);

  // Fetch user settings
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchUserSettings = async () => {
      setIsLoading(true);
      try {
        // Fetch user data from auth
        const { data: authData } = await supabase.auth.getUser();
        setEmail(authData?.user?.email || "");
        setUsername(authData?.user?.user_metadata?.username || "");

        // Fetch user preferences from database
        const { data: prefs, error: prefsError } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (prefsError && prefsError.code !== "PGRST116") {
          console.error("Error fetching preferences:", prefsError);
        }

        if (!prefs) {
          // No preferences found, create default preferences
          const { data: newPrefs, error: insertError } = await supabase
            .from("user_preferences")
            .insert({
              user_id: session.user.id,
              email_notifications: true,
              daily_reminders: true,
              weekly_reports: false,
              achievement_alerts: true,
            })
            .select()
            .single();

          if (insertError) {
            console.error("Error creating default preferences:", insertError);
          } else if (newPrefs) {
            setNotifications({
              emailNotifications: newPrefs.email_notifications,
              dailyReminders: newPrefs.daily_reminders,
              weeklyReports: newPrefs.weekly_reports,
              achievementAlerts: newPrefs.achievement_alerts,
            });
          }
        } else {
          // Preferences found, update state
          setNotifications({
            emailNotifications: prefs.email_notifications,
            dailyReminders: prefs.daily_reminders,
            weeklyReports: prefs.weekly_reports,
            achievementAlerts: prefs.achievement_alerts,
          });
        }
      } catch (error) {
        console.error("Unexpected error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSettings();
  }, [session?.user?.id]);

  // Save Username
  const handleSaveUsername = async () => {
    if (!username.trim()) {
      alert("Username cannot be empty!");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { username: username.trim() },
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
    if (!newEmail.trim()) {
      alert("Email cannot be empty!");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      alert("Please enter a valid email address!");
      return;
    }

    if (newEmail.toLowerCase() === email.toLowerCase()) {
      alert("New email must be different from current email!");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail.trim(),
      });

      if (error) throw error;
      alert(
        "Confirmation email sent! Please check both your current and new email inbox to confirm the change."
      );
      setNewEmail("");
    } catch (error) {
      console.error("Error changing email:", error);
      alert("Failed to change email: " + error.message);
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

  // Save notifications
  const handleSaveNotifications = async () => {
    if (!session?.user?.id) {
      alert("User session not found");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("user_preferences")
        .update({
          email_notifications: notifications.emailNotifications,
          daily_reminders: notifications.dailyReminders,
          weekly_reports: notifications.weeklyReports,
          achievement_alerts: notifications.achievementAlerts,
        })
        .eq("user_id", session.user.id);

      if (error) throw error;
      alert("Notification preferences saved successfully!");
    } catch (error) {
      console.error("Error saving notifications:", error);
      alert("Failed to save notifications: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-gray-500/20 via-slate-500/20 to-zinc-500/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 animate-pulse">
          <div className="h-8 bg-white/5 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-white/5 rounded w-1/2"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#1A1D24]/80 border border-white/10 rounded-3xl p-6 animate-pulse">
              <div className="h-6 bg-white/5 rounded w-1/4 mb-4"></div>
              <div className="h-10 bg-white/5 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-500/20 via-slate-500/20 to-zinc-500/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-slate-600 rounded-2xl blur-xl opacity-50" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-400 to-slate-600 flex items-center justify-center">
                <SettingsIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
              <p className="text-gray-400">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-sky-400" />
          <h2 className="text-xl font-bold text-white">Account Settings</h2>
        </div>

        {/* Username Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 hover:border-sky-400/40 rounded-3xl p-6 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-all" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Username</h3>
                <p className="text-sm text-gray-400">Your display name</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20 transition-all"
                  placeholder="Enter username"
                />
              </div>
              <button
                onClick={handleSaveUsername}
                disabled={saving}
                className="group w-full py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative flex items-center gap-2">
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Username
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Email Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 hover:border-green-400/40 rounded-3xl p-6 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-all" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Change Email</h3>
                <p className="text-sm text-gray-400">Update your email address</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-xs font-semibold text-green-400 mb-1">Current Email</p>
                <p className="text-sm text-white">{email || "No email set"}</p>
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20 transition-all"
                  placeholder="Enter new email"
                />
              </div>

              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-400">
                    You will receive confirmation emails at both your current and new email addresses. Click the links to complete the change.
                  </p>
                </div>
              </div>

              <button
                onClick={handleChangeEmail}
                disabled={saving || !newEmail}
                className="group w-full py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative flex items-center gap-2">
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Change Email
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Password Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 hover:border-purple-400/40 rounded-3xl p-6 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Lock className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Change Password</h3>
                <p className="text-sm text-gray-400">Update your password</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-2xl pl-12 pr-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="New password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Confirm password"
                />
              </div>

              {newPassword && (
                <div className="space-y-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <p className="text-xs font-semibold text-purple-400 mb-2">Password Requirements:</p>
                  <div className="flex items-center gap-2">
                    <Check className={`w-4 h-4 ${newPassword.length >= 8 ? 'text-green-400' : 'text-gray-500'}`} />
                    <span className={`text-xs ${newPassword.length >= 8 ? 'text-green-400' : 'text-gray-500'}`}>
                      At least 8 characters
                    </span>
                  </div>
                  {confirmPassword && (
                    <div className="flex items-center gap-2">
                      <Check className={`w-4 h-4 ${newPassword === confirmPassword ? 'text-green-400' : 'text-gray-500'}`} />
                      <span className={`text-xs ${newPassword === confirmPassword ? 'text-green-400' : 'text-gray-500'}`}>
                        Passwords match
                      </span>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleChangePassword}
                disabled={saving || !newPassword || !confirmPassword}
                className="group w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative flex items-center gap-2">
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Changing...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Change Password
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-orange-400" />
          <h2 className="text-xl font-bold text-white">Preferences</h2>
        </div>

        {/* Notifications Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 hover:border-orange-400/40 rounded-3xl p-6 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Bell className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Notifications</h3>
                <p className="text-sm text-gray-400">Manage notification preferences</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {Object.entries({
                emailNotifications: {
                  label: "Email Notifications",
                  description: "Receive updates via email",
                  icon: Mail,
                },
                dailyReminders: {
                  label: "Daily Reminders",
                  description: "Get reminded to practice daily",
                  icon: Bell,
                },
                weeklyReports: {
                  label: "Weekly Reports",
                  description: "Summary of your progress",
                  icon: BarChart3,
                },
                achievementAlerts: {
                  label: "Achievement Alerts",
                  description: "Celebrate your milestones",
                  icon: Sparkles,
                },
              }).map(([key, { label, description, icon: Icon }]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 bg-[#0B0C10]/60 border border-white/10 rounded-2xl hover:border-orange-400/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{label}</p>
                      <p className="text-gray-500 text-xs">{description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[key]}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          [key]: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-red-500"></div>
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveNotifications}
              disabled={saving}
              className="group w-full py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative flex items-center gap-2">
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Preferences
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border border-sky-500/20 rounded-2xl">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-sky-400 font-medium">Your data is secure</p>
            <p className="text-xs text-gray-400 mt-1">
              All settings are encrypted and stored securely. We never share your personal information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;