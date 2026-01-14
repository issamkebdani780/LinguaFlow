import { Mail, Lock, LogIn, Send } from "lucide-react"; // Added Send icon
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../Authcontex";

const SignIn = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // Added for success messages
  const [error, setError] = useState('');
  
  const { signin, resetPassword } = UserAuth(); // Assuming resetPassword exists in context
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data, error: signInError } = await signin(userEmail, userPassword);
      if (signInError) {
        setError(signInError.message);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!userEmail) {
      setError("Please enter your email address first.");
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error: resetError } = await resetPassword(userEmail);
      if (resetError) {
        setError(resetError.message);
      } else {
        setMessage("Password reset link sent to your email!");
      }
    } catch (err) {
      setError("Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0B0C10] relative overflow-hidden">
      {/* Background Gradients (Same as before) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(56,189,248,0.15)_0%,rgba(0,0,0,0)_70%)] rounded-full pointer-events-none"></div>

      <div className="relative z-10 bg-[#111318]/70 border border-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-4xl font-bold text-white mb-4 text-center">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-8">Sign in to continue.</p>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <div className="mt-2 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-sky-500 transition-all">
              <Mail className="w-5 h-5 text-sky-400" />
              <input
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                type="email"
                required
                className="bg-transparent w-full text-gray-200 outline-none placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <div className="mt-2 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-sky-500 transition-all">
              <Lock className="w-5 h-5 text-sky-400" />
              <input
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                type="password"
                required
                className="bg-transparent w-full text-gray-200 outline-none placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'Processing...' : 'Sign In'}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don't have an account?
          <Link to="/signup" className="text-sky-400 ml-1 hover:underline">Create Account</Link>
        </p>
        <p className="text-gray-400 text-sm text-center mt-2">
          or forgot your password?
          <button
            onClick={handleForgotPassword}
            className="text-xs text-sky-400 hover:underline transition-all ml-1 cursor-pointer"
          >
            Forgot Password?
          </button> 
        </p>
      </div>
    </section>
  );
};

export default SignIn;