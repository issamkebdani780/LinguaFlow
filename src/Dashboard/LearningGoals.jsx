import { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";
import { Edit2, X, Save } from "lucide-react";

const LearningGoals = ({ session, aiMinutes }) => {
  const [dailyWords, setDailyWords] = useState({ completed: 0, goal: 10 });
  const [weeklyRevisions, setWeeklyRevisions] = useState({ completed: 0, goal: 15 });
  const [aiChatTime, setAiChatTime] = useState({ completed: aiMinutes, goal: 60 });

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [tempGoalValue, setTempGoalValue] = useState(0);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchData = async () => {
      const userId = session.user.id;

      // Load saved goals from localStorage (or fetch from Supabase)
      const savedGoals = localStorage.getItem(`goals_${userId}`);
      if (savedGoals) {
        const parsed = JSON.parse(savedGoals);
        setDailyWords((prev) => ({ ...prev, goal: parsed.dailyWords || 10 }));
        setWeeklyRevisions((prev) => ({ ...prev, goal: parsed.weeklyRevisions || 15 }));
        setAiChatTime((prev) => ({ ...prev, goal: parsed.aiChatTime || 60 }));
      }

      // 1️⃣ Fetch learned words for today
      const { data: wordsData } = await supabase
        .from("words")
        .select("created_at")
        .eq("user_id", userId);

      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const dailyCount = wordsData?.filter(
        (w) => new Date(w.created_at) >= startOfToday
      ).length || 0;
      setDailyWords((prev) => ({ ...prev, completed: dailyCount }));

      // 2️⃣ Fetch weekly revisions (commented out - implement when ready)
      // const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      // const { data: revisionsData } = await supabase
      //   .from("revisions")
      //   .select("created_at")
      //   .eq("user_id", userId);
      // const weeklyCount = revisionsData?.filter(
      //   (r) => new Date(r.created_at) >= startOfWeek
      // ).length || 0;
      // setWeeklyRevisions((prev) => ({ ...prev, completed: weeklyCount }));

      // 3️⃣ Fetch AI chat time (commented out - implement when ready)
      // const { data: chatData } = await supabase
      //   .from("chat_messages")
      //   .select("message")
      //   .eq("session_id", userId);
      // let minutes = 0;
      // chatData?.forEach((row) => {
      //   try {
      //     const parsed = typeof row.message === "string" ? JSON.parse(row.message) : row.message;
      //     if (parsed.type === "human") minutes += 0.2;
      //     if (parsed.type === "ai") minutes += 1;
      //   } catch (err) {
      //     console.error("Invalid message JSON", err);
      //   }
      // });
      // setAiChatTime((prev) => ({ ...prev, completed: Math.round(minutes) }));
    };

    fetchData();
  }, [session?.user?.id]);

  const calcPercentage = (completed, goal) => {
    if (goal === 0) return 0;
    return Math.round((completed / goal) * 100);
  };

  // Open edit modal
  const handleOpenEdit = (goalType, currentGoal) => {
    setEditingGoal(goalType);
    setTempGoalValue(currentGoal);
    setIsEditModalOpen(true);
  };

  // Save goal changes
  const handleSaveGoal = () => {
    if (tempGoalValue <= 0) {
      alert("Goal must be greater than 0");
      return;
    }

    // Update state based on goal type
    switch (editingGoal) {
      case "daily":
        setDailyWords((prev) => ({ ...prev, goal: tempGoalValue }));
        break;
      case "weekly":
        setWeeklyRevisions((prev) => ({ ...prev, goal: tempGoalValue }));
        break;
      case "chat":
        setAiChatTime((prev) => ({ ...prev, goal: tempGoalValue }));
        break;
      default:
        break;
    }

    // Save to localStorage (or send to Supabase)
    const userId = session?.user?.id;
    if (userId) {
      const goals = {
        dailyWords: editingGoal === "daily" ? tempGoalValue : dailyWords.goal,
        weeklyRevisions: editingGoal === "weekly" ? tempGoalValue : weeklyRevisions.goal,
        aiChatTime: editingGoal === "chat" ? tempGoalValue : aiChatTime.goal,
      };
      localStorage.setItem(`goals_${userId}`, JSON.stringify(goals));
    }

    // Close modal
    setIsEditModalOpen(false);
    setEditingGoal(null);
  };

  const getGoalTitle = () => {
    switch (editingGoal) {
      case "daily":
        return "Daily Words Goal";
      case "weekly":
        return "Weekly Revisions Goal";
      case "chat":
        return "AI Chat Time Goal (minutes)";
      default:
        return "Edit Goal";
    }
  };

  return (
    <>
      <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-1">🎯 Learning Goals</h3>
        <p className="text-sm text-gray-400 mb-6">Track your daily progress</p>

        <div className="space-y-5">
          {/* Daily Word Goal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white flex items-center gap-2">
                Daily Words
                <button
                  onClick={() => handleOpenEdit("daily", dailyWords.goal)}
                  className="text-gray-400 hover:text-sky-400 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </span>
              <span className="text-sm text-sky-400">
                {dailyWords.completed} / {dailyWords.goal} words
              </span>
            </div>
            <div className="w-full bg-[#0B0C10]/50 rounded-full h-3 overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${calcPercentage(dailyWords.completed, dailyWords.goal)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {calcPercentage(dailyWords.completed, dailyWords.goal)}% of daily goal
            </p>
          </div>

          {/* Weekly Revision Goal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white flex items-center gap-2">
                Weekly Revisions
                <button
                  onClick={() => handleOpenEdit("weekly", weeklyRevisions.goal)}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </span>
              <span className="text-sm text-purple-400">
                {weeklyRevisions.completed} / {weeklyRevisions.goal} reviews
              </span>
            </div>
            <div className="w-full bg-[#0B0C10]/50 rounded-full h-3 overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${calcPercentage(weeklyRevisions.completed, weeklyRevisions.goal)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {calcPercentage(weeklyRevisions.completed, weeklyRevisions.goal)}% of weekly goal
            </p>
          </div>

          {/* AI Chat Time Goal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white flex items-center gap-2">
                AI Chat Time
                <button
                  onClick={() => handleOpenEdit("chat", aiChatTime.goal)}
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </span>
              <span className="text-sm text-green-400">
                {aiChatTime.completed} / {aiChatTime.goal} min
              </span>
            </div>
            <div className="w-full bg-[#0B0C10]/50 rounded-full h-3 overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${calcPercentage(aiChatTime.completed, aiChatTime.goal)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {calcPercentage(aiChatTime.completed, aiChatTime.goal)}% of goal
            </p>
          </div>
        </div>
      </div>

      {/* Edit Goal Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-8 rounded-3xl bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 m-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 mb-4">
                <Edit2 className="text-white w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">{getGoalTitle()}</h2>
              <p className="text-gray-400 text-sm mt-2">Set your target goal</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Goal Value
                </label>
                <input
                  type="number"
                  min="1"
                  value={tempGoalValue}
                  onChange={(e) => setTempGoalValue(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#0B0C10]/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-2xl font-bold placeholder-gray-600 focus:outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/50 transition-all"
                  placeholder="10"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGoal}
                  className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Goal
                </button>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-gray-400 mb-3">Quick suggestions:</p>
              <div className="flex gap-2 flex-wrap">
                {editingGoal === "daily" && [5, 10, 15, 20].map((val) => (
                  <button
                    key={val}
                    onClick={() => setTempGoalValue(val)}
                    className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 text-xs font-medium transition-all"
                  >
                    {val} words
                  </button>
                ))}
                {editingGoal === "weekly" && [10, 15, 20, 25].map((val) => (
                  <button
                    key={val}
                    onClick={() => setTempGoalValue(val)}
                    className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs font-medium transition-all"
                  >
                    {val} reviews
                  </button>
                ))}
                {editingGoal === "chat" && [30, 60, 90, 120].map((val) => (
                  <button
                    key={val}
                    onClick={() => setTempGoalValue(val)}
                    className="px-3 py-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs font-medium transition-all"
                  >
                    {val} min
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LearningGoals;