// src/components/Dashboard.jsx
import { useEffect, useState } from "react";
import { UserAuth } from "../Authcontex";
import { supabase } from "../SupabaseClient";
import {
  Bot,
  Plus,
  Search,
  Send,
  BookOpen,
  Trash2,
  Edit,
  Volume2,
  X,
  Menu,
  LogOut,
  User,
  Settings,
  BarChart3,
} from "lucide-react";

const Dashboard = ({ onLogout }) => {
  const { session } = UserAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("add-word");

  // Word Management
  const [newWord, setNewWord] = useState("");
  const [arabicTranslation, setArabicTranslation] = useState("");
  const [words, setWords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWords = words.filter(
    (word) =>
      word.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.arabic.includes(searchQuery)
  );

  // Chatbot
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "bot",
      message:
        "Hi! I'm your LinguaFlow AI assistant. Send me any English word and I'll help you learn it!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

      setWords(data);
    };

    fetchWords();
  }, [session]);

  const handleAddWord = async (e) => {
    e.preventDefault();

    if (!newWord.trim() || !arabicTranslation.trim()) return;

    const { data, error } = await supabase
      .from("words")
      .insert([
        {
          user_id: session.user.id,
          english: newWord,
          arabic: arabicTranslation,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting word:", error.message);
      return;
    }

    setWords((prev) => [data, ...prev]);
    setNewWord("");
    setArabicTranslation("");
  };

  const handleDeleteWord = async (id) => {
  const { data, error } = await supabase
    .from("words")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.id)
    .select();

  if (error) {
    console.error("Error deleting word:", error.message);
    return;
  }

  console.log("Deleted data:", data);
  setWords((prevWords) => prevWords.filter((word) => word.id !== id));
};


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;

    // show user message instantly
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "user",
        message: userMessage,
      },
    ]);

    setChatInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://n8n.linguaflo.me/webhook-test/linguaflow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id, // ✅ session user id
            message: userMessage, // ✅ user message
          }),
        }
      );

      const data = await response.json();

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          message:
            data.message || data.response || "Message received successfully.",
        },
      ]);
    } catch (error) {
      console.error("Webhook error:", error);

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          message: "Error communicating with AI service.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
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
                  ? "bg-sky-600 text-white"
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
                  ? "bg-sky-600 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">My Words</span>
              <span className="ml-auto bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full text-xs">
                {words.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("chatbot")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "chatbot"
                  ? "bg-sky-600 text-white"
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
                  ? "bg-sky-600 text-white"
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
                  ? "bg-sky-600 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {session?.user?.user_metadata?.username || "User"}
                </p>
                <p className="text-xs text-gray-400">Pro Member</p>
              </div>
              <button
                onClick={onLogout}
                className="text-gray-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-[#0B0C10] border-b border-white/5 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {activeTab === "add-word" && "Add New Word"}
                  {activeTab === "my-words" && "My Vocabulary"}
                  {activeTab === "chatbot" && "AI Assistant"}
                  {activeTab === "stats" && "Learning Statistics"}
                  {activeTab === "settings" && "Settings"}
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  {activeTab === "add-word" && "Add and manage your vocabulary"}
                  {activeTab === "my-words" &&
                    `${words.length} words in your collection`}
                  {activeTab === "chatbot" && "Chat with AI to learn new words"}
                  {activeTab === "stats" && "Track your learning progress"}
                  {activeTab === "settings" && "Customize your experience"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* Add Word Tab */}
          {activeTab === "add-word" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Add New Word
                    </h2>
                    <p className="text-sm text-gray-400">
                      Expand your vocabulary
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAddWord} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      English Word
                    </label>
                    <input
                      type="text"
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      placeholder="e.g., Serendipity"
                      className="w-full bg-[#0B0C10]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Arabic Translation
                    </label>
                    <input
                      type="text"
                      value={arabicTranslation}
                      onChange={(e) => setArabicTranslation(e.target.value)}
                      placeholder="e.g., صدفة سعيدة"
                      className="w-full bg-[#0B0C10]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
                      dir="rtl"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Word
                  </button>
                </form>

                <div className="mt-6 p-4 bg-sky-500/10 border border-sky-500/20 rounded-xl">
                  <p className="text-sm text-sky-400">
                    💡 <strong>Tip:</strong> Words added here will be
                    automatically reviewed using spaced repetition.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* My Words Tab */}
          {activeTab === "my-words" && (
            <div className="max-w-4xl mx-auto">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your words..."
                    className="w-full bg-[#1A1D24]/60 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Words List */}
              <div className="space-y-3">
                {filteredWords.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-3xl">
                    <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">
                      No words found
                    </h3>
                    <p className="text-gray-500">
                      Start adding words to build your vocabulary!
                    </p>
                  </div>
                ) : (
                  filteredWords.map((word) => (
                    <div
                      key={word.id}
                      className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-sky-400/30 transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white">
                              {word.english}
                            </h3>
                            <button className="text-gray-400 hover:text-sky-400 transition-colors">
                              <Volume2 className="w-5 h-5" />
                            </button>
                          </div>
                          <p className="text-lg text-gray-400 mb-2" dir="rtl">
                            {word.arabic}
                          </p>
                          <p className="text-xs text-gray-500">
                            Added:{" "}
                            {new Date(word.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-gray-400 hover:text-sky-400 transition-colors p-2 rounded-lg hover:bg-white/5">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteWord(word.id)}
                            className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-white/5"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Chatbot Tab */}
          {activeTab === "chatbot" && (
            <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
              <div className="flex-1 bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.type === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                          msg.type === "user"
                            ? "bg-sky-600 text-white rounded-tr-sm"
                            : "bg-[#1A1D24] text-gray-200 border border-white/10 rounded-tl-sm"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#1A1D24] text-gray-200 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a word or message..."
                    className="flex-1 bg-[#0B0C10]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === "stats" && (
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-400 text-sm">Total Words</h3>
                    <BookOpen className="w-5 h-5 text-sky-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {words.length}
                  </p>
                </div>
                <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-400 text-sm">This Week</h3>
                    <BarChart3 className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">12</p>
                </div>
                <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-400 text-sm">Streak</h3>
                    <span className="text-2xl">🔥</span>
                  </div>
                  <p className="text-3xl font-bold text-white">7 days</p>
                </div>
              </div>
              <div className="text-center text-gray-400 py-12">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p>More statistics coming soon!</p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                <h2 className="text-xl font-bold text-white mb-6">Settings</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <h3 className="text-white font-semibold mb-2">Account</h3>
                    <p className="text-sm text-gray-400">
                      Manage your account settings
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <h3 className="text-white font-semibold mb-2">
                      Notifications
                    </h3>
                    <p className="text-sm text-gray-400">
                      Configure notification preferences
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <h3 className="text-white font-semibold mb-2">Language</h3>
                    <p className="text-sm text-gray-400">
                      Change interface language
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
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
