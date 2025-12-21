import { Mail, Lock, UserPlus } from "lucide-react";
import { use, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../Authcontex";

const SignUp = () => {
  const [userName, setuserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { session, signUp } = UserAuth();
  const navigate = useNavigate();

  const isStrongPassword = (password) => {
    const minLength = /.{8,}/;
    const uppercase = /[A-Z]/;
    const number = /[0-9]/;
    const specialChar = /[@$!%*?&#^()-_=+]/;

    return (
      minLength.test(password) &&
      uppercase.test(password) &&
      number.test(password) &&
      specialChar.test(password)
    );
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // password strength check
    if (!isStrongPassword(userPassword)) {
      setError(
        "Password must be at least 8 characters long, contain uppercase letters, numbers, and special characters."
      );
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await signUp(
        userEmail,
        userName,
        userPassword
      );

      if (signUpError) {
        setError(signUpError.message);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0B0C10] relative overflow-hidden">
      {/* Gradients */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] 
        bg-[radial-gradient(circle,rgba(56,189,248,0.15)_0%,rgba(0,0,0,0)_70%)] 
        rounded-full pointer-events-none"
      ></div>

      <div
        className="absolute bottom-0 right-0 translate-y-1/3 w-[600px] h-[600px] 
        bg-[radial-gradient(circle,rgba(168,85,247,0.1)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"
      ></div>

      {/* Card */}
      <div
        className="relative z-10 bg-[#111318]/70 border border-white/10 backdrop-blur-xl
        p-10 rounded-3xl shadow-2xl max-w-md w-full"
      >
        <h2 className="text-4xl font-bold text-white mb-4 text-center">
          Create Account
        </h2>
        <p className="text-gray-400 text-center mb-8">Join LinguaFlow.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label className="text-gray-300 text-sm">Username</label>
            <div
              className="mt-2 flex items-center gap-3 bg-white/5 border border-white/10 
              rounded-xl px-4 py-3 focus-within:border-sky-500 transition-all"
            >
              <UserPlus className="w-5 h-5 text-sky-400" />
              <input
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
                type="text"
                required
                className="bg-transparent text-gray-200 w-full outline-none placeholder-gray-400"
                placeholder="username"
              />
            </div>
          </div>

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
                className="bg-transparent text-gray-200 w-full outline-none placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
  <label className="text-gray-300 text-sm">Password</label>
  <div className="mt-2 flex items-center gap-3 bg-white/5 border border-white/10 
    rounded-xl px-4 py-3 focus-within:border-sky-500 transition-all relative">
    
    <Lock className="w-5 h-5 text-sky-400" />

    <input
      value={userPassword}
      onChange={(e) => setUserPassword(e.target.value)}
      type={showPassword ? "text" : "password"}
      required
      className="bg-transparent text-gray-200 w-full outline-none placeholder-gray-400"
      placeholder="••••••••"
    />

    {/* Toggle Button */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 text-gray-400 hover:text-white"
    >
      {showPassword ? "🙈" : "👁️"}
    </button>
  </div>
</div>


          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-indigo-600 hover:bg-indigo-500
            text-white font-semibold transition-all flex justify-center gap-2 items-center
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-5 h-5" />
            {loading ? "Signing Up..." : "Sign Up"}
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
