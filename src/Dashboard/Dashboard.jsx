import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../Authcontex";
import { Bot } from 'lucide-react';
const Dashboard = () => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10]">
      <header className="bg-[#111318]/70 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center">
                    <Bot className="text-white w-5 h-5" />
                  </div>
                  <span className="font-bold text-xl tracking-tight text-white">Lingua<span className="text-sky-400">Flow</span></span>
                </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-gray-400">
                <User className="w-5 h-5" />
                <span className="text-sm">
                  {session?.user?.user_metadata?.userName || session?.user?.email}
                </span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 
                  text-red-400 rounded-lg border border-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-400">
            You're logged in as {session?.user?.email}
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#111318]/70 border border-white/10 backdrop-blur-xl p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-white mb-2">
              Start Learning
            </h3>
            <p className="text-gray-400 text-sm">
              Begin your language learning journey with AI-powered lessons.
            </p>
          </div>

          <div className="bg-[#111318]/70 border border-white/10 backdrop-blur-xl p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-white mb-2">
              Your Progress
            </h3>
            <p className="text-gray-400 text-sm">
              Track your learning progress and achievements.
            </p>
          </div>

          <div className="bg-[#111318]/70 border border-white/10 backdrop-blur-xl p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-white mb-2">
              Practice
            </h3>
            <p className="text-gray-400 text-sm">
              Practice with interactive exercises and quizzes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;