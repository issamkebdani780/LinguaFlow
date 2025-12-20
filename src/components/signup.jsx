import { Mail, Lock, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0B0C10] relative overflow-hidden">
      {/* Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] 
        bg-[radial-gradient(circle,rgba(56,189,248,0.15)_0%,rgba(0,0,0,0)_70%)] 
        rounded-full pointer-events-none"></div>

      <div className="absolute bottom-0 right-0 translate-y-1/3 w-[600px] h-[600px] 
        bg-[radial-gradient(circle,rgba(168,85,247,0.1)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>

      {/* Card */}
      <div className="relative z-10 bg-[#111318]/70 border border-white/10 backdrop-blur-xl
        p-10 rounded-3xl shadow-2xl max-w-md w-full">

        <h2 className="text-4xl font-bold text-white mb-4 text-center">
          Create Account
        </h2>
        <p className="text-gray-400 text-center mb-8">Join LinguaFlow.</p>

        <form className="space-y-6">
          <div>
            <label className="text-gray-300 text-sm">username</label>
            <div className="mt-2 flex items-center gap-3 bg-white/5 border border-white/10 
              rounded-xl px-4 py-3 focus-within:border-sky-500 transition-all">
              <UserPlus className="w-5 h-5 text-sky-400" />
              <input
                type="text"
                className="bg-transparent text-gray-200 w-full outline-none placeholder-gray-400"
                placeholder="username"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <div className="mt-2 flex items-center gap-3 bg-white/5 border border-white/10 
              rounded-xl px-4 py-3 focus-within:border-sky-500 transition-all">
              <Mail className="w-5 h-5 text-sky-400" />
              <input
                type="email"
                className="bg-transparent text-gray-200 w-full outline-none placeholder-gray-400"
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
                className="bg-transparent text-gray-200 w-full outline-none placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button className="w-full py-4 rounded-full bg-indigo-600 hover:bg-indigo-500
            text-white font-semibold transition-all flex justify-center gap-2 items-center">
            <UserPlus className="w-5 h-5" />
            Sign Up
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?
          <Link to="/signin" className="text-sky-400 ml-1 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
