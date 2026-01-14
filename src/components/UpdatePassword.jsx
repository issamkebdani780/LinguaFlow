import { useState } from "react";
import { UserAuth } from "../Authcontex";
import { useNavigate } from "react-router-dom";
import { Lock, Save } from "lucide-react";

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { updatePassword } = UserAuth();
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await updatePassword(newPassword);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert("Password updated successfully!");
      navigate("/signin");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0B0C10]">
      <div className="bg-[#111318]/70 border border-white/10 p-10 rounded-3xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Set New Password</h2>
        
        {error && <div className="mb-4 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/50">{error}</div>}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <Lock className="text-sky-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Enter new password"
              className="bg-transparent w-full text-white outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UpdatePassword;