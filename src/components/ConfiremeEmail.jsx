import { MailCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ConfirmEmail = () => {
  const location = useLocation();
  const userEmail = location.state?.email; // optional if you want to pass email

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0c] to-[#1a1c20] text-white px-6">
      <div className="backdrop-blur-xl bg-white/5 p-10 rounded-2xl border border-white/10 shadow-xl max-w-md text-center">

        <MailCheck className="mx-auto text-blue-400 mb-4" size={60} />

        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Verify Your Email
        </h1>

        <p className="text-gray-300 leading-relaxed mb-6">
          We’ve sent a verification link to your email address.
        </p>

        {userEmail && (
          <p className="text-blue-400 font-semibold mb-6">{userEmail}</p>
        )}

        <p className="text-gray-400 mb-6">
          Please check your inbox (and spam folder).  
          Click on the confirmation link before logging in.
        </p>

        <Link
          to="/signin"
          className="block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
        >
          Go to Login
        </Link>

      </div>
    </div>
  );
};

export default ConfirmEmail;
