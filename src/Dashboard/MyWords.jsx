// src/components/MyWords.jsx
import { useState } from "react";
import { UserAuth } from "../Authcontex";
import { supabase } from "../SupabaseClient";
import { Search, BookOpen, Trash2, Edit, X, Calendar, Sparkles } from "lucide-react";

const MyWords = ({ words, onWordsUpdate }) => {
  const { session } = UserAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [editEnglish, setEditEnglish] = useState("");
  const [editArabic, setEditArabic] = useState("");

  const filteredWords = words.filter(
    (word) =>
      word.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.arabic.includes(searchQuery)
  );

  const handleDeleteWord = async (id) => {
    const { error } = await supabase
      .from("words")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error deleting word:", error);
      alert("Failed to delete word: " + error.message);
      return;
    }

    onWordsUpdate(words.filter((word) => word.id !== id));
  };

  const handleOpenEditModal = (word) => {
    setEditingWord(word);
    setEditEnglish(word.english);
    setEditArabic(word.arabic);
    setIsEditModalOpen(true);
  };

  const handleUpdateWord = async (e) => {
    e.preventDefault();
    if (!editEnglish.trim() || !editArabic.trim()) return;

    const { data, error } = await supabase
      .from("words")
      .update({
        english: editEnglish.trim(),
        arabic: editArabic.trim(),
      })
      .eq("id", editingWord.id)
      .eq("user_id", session.user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating word:", error);
      alert("Failed to update word: " + error.message);
      return;
    }

    onWordsUpdate(words.map((word) => (word.id === editingWord.id ? data : word)));
    setIsEditModalOpen(false);
    setEditingWord(null);
    setEditEnglish("");
    setEditArabic("");
  };

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl blur-xl opacity-50" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">My Vocabulary</h1>
                  <p className="text-gray-400">{words.length} words in your collection</p>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="px-6 py-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{words.length}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Total Words</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by English or Arabic..."
            className="w-full bg-[#1A1D24]/80 backdrop-blur-xl border border-white/10 rounded-2xl pl-14 pr-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Words Grid */}
        {filteredWords.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 rounded-3xl">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full blur-2xl opacity-30" />
              <BookOpen className="relative w-20 h-20 text-gray-600 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              {searchQuery ? "No matching words" : "No words yet"}
            </h3>
            <p className="text-gray-500">
              {searchQuery ? "Try a different search term" : "Start adding words to build your vocabulary!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWords.map((word, index) => (
              <div
                key={word.id}
                className="group relative overflow-hidden bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 hover:border-indigo-400/40 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                        {word.english}
                      </h3>
                      <p className="text-xl text-gray-400 mb-3" dir="rtl">
                        {word.arabic}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(word)}
                        className="p-2 rounded-xl text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteWord(word.id)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Added {new Date(word.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-gradient-to-br from-[#1A1D24] to-[#0B0C10] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
                  <Edit className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Edit Word</h2>
              <p className="text-gray-400">Update your vocabulary entry</p>
            </div>

            <form onSubmit={handleUpdateWord} className="space-y-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  English Word
                </label>
                <input
                  type="text"
                  required
                  value={editEnglish}
                  onChange={(e) => setEditEnglish(e.target.value)}
                  className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  placeholder="English word"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Translation
                </label>
                <input
                  type="text"
                  required
                  value={editArabic}
                  onChange={(e) => setEditArabic(e.target.value)}
                  className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Arabic translation"
                  dir="rtl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold transition-all"
              >
                Update Word
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MyWords;