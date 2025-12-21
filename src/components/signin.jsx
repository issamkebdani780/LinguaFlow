import { Mail, Lock, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../Authcontex";

const SignIn = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signin } = UserAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await signin(userEmail, userPassword);
      
      if (signInError) {
        setError(signInError.message);
        console.error(signInError);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0B0C10] relative overflow-hidden">
      {/* Decorative Gradients */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] 
        bg-[radial-gradient(circle,rgba(56,189,248,0.15)_0%,rgba(0,0,0,0)_70%)] 
        rounded-full pointer-events-none"
      ></div>

      <div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] translate-y-1/3 
        bg-[radial-gradient(circle,rgba(168,85,247,0.1)_0%,rgba(0,0,0,0)_70%)] 
        pointer-events-none"
      ></div>

      {/* Auth Card */}
      <div
        className="relative z-10 bg-[#111318]/70 border border-white/10 backdrop-blur-xl 
         p-10 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-4xl font-bold text-white mb-4 text-center">
          Welcome Back
        </h2>
        <p className="text-gray-400 text-center mb-8">Sign in to continue.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <div
              className="mt-2 flex items-center gap-3 bg-white/5 border border-white/10 
              rounded-xl px-4 py-3 focus-within:border-sky-500 transition-all"
            >
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
            <label className="text-gray-300 text-sm">Password</label>
            <div
              className="mt-2 flex items-center gap-3 bg-white/5 border border-white/10 
              rounded-xl px-4 py-3 focus-within:border-sky-500 transition-all"
            >
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
            className="w-full py-4 rounded-full bg-sky-600 hover:bg-sky-500 
            text-white font-semibold transition-all flex items-center justify-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don't have an account?
          <Link to="/signup" className="text-sky-400 ml-1 hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignIn;