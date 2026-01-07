// src/components/AddWord.jsx
import { useState } from "react";
import { UserAuth } from "../Authcontex";
import { supabase } from "../SupabaseClient";
import { Plus, Sparkles, Zap } from "lucide-react";

const AddWord = ({ onWordAdded }) => {
  const { session } = UserAuth();
  const [newWord, setNewWord] = useState("");
  const [arabicTranslation, setArabicTranslation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddWord = async (e) => {
    e.preventDefault();
    if (!newWord.trim() || !arabicTranslation.trim()) return;

    setIsSubmitting(true);

    const { data, error } = await supabase
      .from("words")
      .insert([
        {
          user_id: session.user.id,
          english: newWord.trim(),
          arabic: arabicTranslation.trim(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting word:", error.message);
      alert("Failed to add word: " + error.message);
      setIsSubmitting(false);
      return;
    }

    // Notify parent component
    if (onWordAdded) onWordAdded(data);

    setNewWord("");
    setArabicTranslation("");
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-500/20 via-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-indigo-600 rounded-2xl blur-xl opacity-50" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center">
                <Plus className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Add New Word</h1>
              <p className="text-gray-400">Build your vocabulary one word at a time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Form Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl" />
        
        <form onSubmit={handleAddWord} className="relative z-10 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <Sparkles className="w-4 h-4 text-sky-400" />
              English Word
            </label>
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Enter an English word..."
              className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20 transition-all text-lg"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Arabic Translation
            </label>
            <input
              type="text"
              value={arabicTranslation}
              onChange={(e) => setArabicTranslation(e.target.value)}
              placeholder="أدخل الترجمة العربية..."
              className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all text-lg"
              dir="rtl"
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full py-4 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding Word...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Add to Collection
                </>
              )}
            </span>
          </button>
        </form>
      </div>

      {/* Tips Card */}
      <div className="bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-sky-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-sky-400" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white">Pro Tips</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>• Words are automatically saved to your personal collection</li>
              <li>• Practice with AI chat to reinforce learning</li>
              <li>• Track your progress in the Statistics section</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWord;