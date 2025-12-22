import { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";
import { UserAuth } from "../Authcontex";
import { PlusCircle, Book, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import Chatbot from "./Chatbot";

const Dashboard = () => {
  const { session, signOut } = UserAuth();
  

  const [english, setEnglish] = useState("");
  const [arabic, setArabic] = useState("");
  const [words, setWords] = useState([]);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    if (!session) return;
    const { data, error } = await supabase
      .from("words")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (!error) setWords(data);
  };

  const addWord = async (e) => {
    e.preventDefault();

    if (!english || !arabic) return;

    const { error } = await supabase.from("words").insert({
      english,
      arabic,
      user_id: session.user.id,
    });

    if (!error) {
      setEnglish("");
      setArabic("");
      fetchWords();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0c] to-[#1a1c20] text-white">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full backdrop-blur-xl bg-white/5 border-b border-white/10 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* Logo */}
          <Link to="/dashboard" className="text-2xl font-extrabold tracking-wide">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Linguaflow
            </span>
          </Link>

          <div className="flex items-center gap-6">

            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition font-semibold"
            >
              <LogOut size={18} /> Logout
            </button>

          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 max-w-5xl mx-auto px-6">

        {/* Title */}
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-8">
          Linguaflow Dashboard
        </h1>

        {/* Add Word */}
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl shadow-xl border border-white/10 mb-10">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
            <PlusCircle className="text-blue-400" /> Add New Word
          </h2>

          <form onSubmit={addWord} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="English word..."
              className="w-full px-4 py-3 bg-[#111318] border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
            />

            <input
              type="text"
              placeholder="Arabic translation..."
              className="w-full px-4 py-3 bg-[#111318] border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={arabic}
              onChange={(e) => setArabic(e.target.value)}
            />

            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition">
              Add
            </button>
          </form>
        </div>

        {/* Words List */}
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl shadow-xl border border-white/10">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
            <Book className="text-purple-400" /> My Vocabulary
          </h2>

          <div className="space-y-3">
            {words.length === 0 && (
              <p className="text-gray-400">No words added yet.</p>
            )}

            {words.map((word) => (
              <div key={word.id} className="bg-[#111318] border border-white/10 rounded-xl px-4 py-3 flex justify-between">
                <span className="font-bold text-blue-300">{word.english}</span>
                <span className="text-green-300">{word.arabic}</span>
              </div>
            ))}
          </div>

        </div>

        {/*chatbot*/}
        <Chatbot userId={session.user.id} />
      </div>
    </div>
  );
};

export default Dashboard;
