import { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";

function Achievements({ session, words, longestStreak }) {
  const [maxWords, setMaxWords] = useState(0);

  useEffect(() => {
    const getMaxWordsInOneDay = async (userId) => {
      if (!userId) return 0;

      try {
        const { data, error } = await supabase
          .from("words")
          .select("id, created_at")
          .eq("user_id", userId);

        if (error) {
          console.error("Error fetching learned words:", error);
          return 0;
        }

        if (!data || data.length === 0) return 0;

        const dayCounts = data.reduce((acc, row) => {
          const date = new Date(row.created_at);
          const dayKey = date.toISOString().split("T")[0]; 
          acc[dayKey] = (acc[dayKey] || 0) + 1;
          return acc;
        }, {});

        // Get the maximum value
        const maxWords = Math.max(...Object.values(dayCounts));

        return maxWords;
      } catch (err) {
        console.error("Unexpected error:", err);
        return 0;
      }
    };

    // Call the async function
    if (session?.user?.id) {
      getMaxWordsInOneDay(session.user.id).then((result) => {
        setMaxWords(result);
      });
    }
  }, [session?.user?.id]);

  return (
    <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-6">🏆 Achievements</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl text-center">
          <span className="text-4xl mb-2 block">🔥</span>
          <p className="font-bold text-white text-sm">{longestStreak}-Day Streak</p>
          <p className="text-xs text-gray-400 mt-1">Keep it up!</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-sky-500/20 to-blue-500/20 border border-sky-500/30 rounded-xl text-center">
          <span className="text-4xl mb-2 block">📚</span>
          <p className="font-bold text-white text-sm">{words.length}+ Words</p>
          <p className="text-xs text-gray-400 mt-1">Vocabulary Builder</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl text-center">
          <span className="text-4xl mb-2 block">⚡</span>
          <p className="font-bold text-white text-sm">Fast Learner</p>
          <p className="text-xs text-gray-400 mt-1">{maxWords} words in a day</p>
        </div>
        <div className={`p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl text-center ${longestStreak < 30 ? 'opacity-50' : ''}`}>
          <span className="text-4xl mb-2 block">🎯</span>
          <p className="font-bold text-white text-sm">30-Day Learner</p>
          <p className="text-xs text-gray-400 mt-1">
            {longestStreak >= 30 ? 'Unlocked! 🎉' : `Locked (${30 - longestStreak} days left)`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Achievements;