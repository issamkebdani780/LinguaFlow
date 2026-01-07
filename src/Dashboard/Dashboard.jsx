import { useEffect, useState } from "react";
import { UserAuth } from "../Authcontex";
import { supabase } from "../SupabaseClient";
import {
  Bot,
  Plus,
  BookOpen,
  Menu,
  LogOut,
  User,
  Settings,
  BarChart3,
} from "lucide-react";

import AddWord from "./AddWord";
import MyWords from "./MyWords";
import ChatBot from "./ChatBot";
import Statics from "./Statics";
import Setings from "./Setings";

const Dashboard = () => {
  const { session, signOut } = UserAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("add-word");
  const [words, setWords] = useState([]);
  
  useEffect(() => {
    if (!session?.user) return;

    const fetchWords = async () => {
      const { data, error } = await supabase
        .from("words")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching words:", error.message);
        return;
      }

      setWords(data || []);
    };

    fetchWords();
  }, [session]);

  const handleWordAdded = (newWord) => {
    setWords((prev) => [newWord, ...prev]);
  };

  const handleWordsUpdate = (updatedWords) => {
    setWords(updatedWords);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0B0C10] border-r border-white/5 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center">
                <Bot className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-lg">
                Lingua<span className="text-sky-400">Flow</span>
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveTab("add-word")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "add-word"
                  ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-lg shadow-sky-500/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Word</span>
            </button>

            <button
              onClick={() => setActiveTab("my-words")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "my-words"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">My Words</span>
              <span className="ml-auto bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full text-xs font-bold">
                {words.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("chatbot")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "chatbot"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Bot className="w-5 h-5" />
              <span className="font-medium">AI Chat</span>
            </button>

            <button
              onClick={() => setActiveTab("stats")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "stats"
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Statistics</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "settings"
                  ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-500/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {session.user.user_metadata.username || "User"}
                </p>
                <p className="text-xs text-gray-500">Premium Member</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer p-2 rounded-lg hover:bg-red-500/10"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Menu Button */}
        <div className="lg:hidden p-4 bg-[#0B0C10] border-b border-white/5">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white transition-all p-2 rounded-xl hover:bg-white/5"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {activeTab === "add-word" && <AddWord onWordAdded={handleWordAdded} />}
          {activeTab === "my-words" && (
            <MyWords words={words} onWordsUpdate={handleWordsUpdate} />
          )}
          {activeTab === "chatbot" && <ChatBot />}
          {activeTab === "stats" && <Statics words={words} />}
          {activeTab === "settings" && <Setings />}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;