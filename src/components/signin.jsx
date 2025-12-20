import { Mail, Lock, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0B0C10] relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] 
        bg-[radial-gradient(circle,rgba(56,189,248,0.15)_0%,rgba(0,0,0,0)_70%)] 
        rounded-full pointer-events-none"></div>

      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] translate-y-1/3 
        bg-[radial-gradient(circle,rgba(168,85,247,0.1)_0%,rgba(0,0,0,0)_70%)] 
        pointer-events-none"></div>

      {/* Auth Card */}
      <div className="relative z-10 bg-[#111318]/70 border border-white/10 backdrop-blur-xl 
         p-10 rounded-3xl shadow-2xl w-full max-w-md">

        <h2 className="text-4xl font-bold text-white mb-4 text-center">
          Welcome Back
        </h2>
        <p className="text-gray-400 text-center mb-8">Sign in to continue.</p>

        <form className="space-y-6">
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <div className="mt-2 flex items-center gap-3 bg-white/5 border border-white/10 
              rounded-xl px-4 py-3 focus-within:border-sky-500 transition-all">
              <Mail className="w-5 h-5 text-sky-400" />
              <input
                type="email"
                className="bg-transparent w-full text-gray-200 outline-none placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <div className="mt-2 flex items-center gap-3 bg-white/5 border border-white/10 
              rounded-xl px-4 py-3 focus-within:border-sky-500 transition-all">
              <Lock className="w-5 h-5 text-sky-400" />
              <input
                type="password"
                className="bg-transparent w-full text-gray-200 outline-none placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button className="w-full py-4 rounded-full bg-sky-600 hover:bg-sky-500 
            text-white font-semibold transition-all flex items-center justify-center gap-2">
            <LogIn className="w-5 h-5" />
            Sign In
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don’t have an account?
          <Link to="/signup" className="text-sky-400 ml-1 hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignIn;
