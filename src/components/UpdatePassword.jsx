import { useState, useEffect } from "react";
import { UserAuth } from "../Authcontex"; // Check your spelling of 'Authcontex'
import { useNavigate } from "react-router-dom";
import { Lock, Save, ShieldCheck } from "lucide-react";

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const { updatePassword } = UserAuth();
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error } = await updatePassword(newPassword);
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Give the user 2 seconds to see the success message
        setTimeout(() => navigate("/signin"), 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0B0C10]">
      <div className="bg-[#111318]/70 border border-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-6">
            <div className="p-3 bg-sky-500/10 rounded-full">
                <ShieldCheck className="text-sky-400 w-8 h-8" />
            </div>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2 text-center">New Password</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Please enter a secure new password.</p>
        
        {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
            </div>
        )}

        {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm">
                Password updated! Redirecting to sign in...
            </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-sky-500 transition-all">
            <Lock className="text-sky-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Minimum 6 characters"
              className="bg-transparent w-full text-white outline-none placeholder-gray-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-4 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? "Saving..." : "Save New Password"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UpdatePassword;