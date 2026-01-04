import { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";
import { Edit2, X, Save } from "lucide-react";

const LearningGoals = ({ session, aiMinutes }) => {
  const [dailyWords, setDailyWords] = useState({ completed: 0, goal: 10 });
  const [weeklyRevisions, setWeeklyRevisions] = useState({
    completed: 0,
    goal: 15,
  });
  const [aiChatTime, setAiChatTime] = useState({
    completed: aiMinutes,
    goal: 10,
  });

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [tempGoalValue, setTempGoalValue] = useState(0);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchData = async () => {
      const userId = session.user.id;

      const { data: goals, error } = await supabase
        .from("user_goals")
        .select("*")
        .eq("user_id", userId)
        .single();

      

      if (!goals) {
        // create default goals if not exists
        const { data: newGoals } = await supabase
          .from("user_goals")
          .insert({
            user_id: userId,
            daily_word_goal: 10,
            weekly_revision_goal: 15,
            ai_chat_time_goal: 60,
          })
          .select()
          .single();

        setDailyWords((p) => ({ ...p, goal: newGoals.daily_word_goal }));
        setWeeklyRevisions((p) => ({
          ...p,
          goal: newGoals.weekly_revision_goal,
        }));
        setAiChatTime((p) => ({ ...p, goal: newGoals.ai_chat_time_goal }));
      } else {
        setDailyWords((p) => ({ ...p, goal: goals.daily_word_goal }));
        setWeeklyRevisions((p) => ({ ...p, goal: goals.weekly_revision_goal }));
        setAiChatTime((p) => ({ ...p, goal: goals.ai_chat_time_goal }));
      }

      const today = new Date();
      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const { data: wordsData } = await supabase
        .from("words")
        .select("created_at")
        .eq("user_id", userId)
        .gte("created_at", startOfToday.toISOString());

      setDailyWords((p) => ({ ...p, completed: wordsData?.length || 0 }));

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

      const { data: revisionData } = await supabase
        .from("revisions")
        .select("created_at")
        .eq("user_id", userId)
        .gte("created_at", startOfWeek.toISOString());

      setWeeklyRevisions((p) => ({
        ...p,
        completed: revisionData?.length || 0,
      }));

      setAiChatTime((p) => ({ ...p, completed: aiMinutes }));
    };

    fetchData();
  }, [session?.user?.id, aiMinutes]);

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
  const handleSaveGoal = async () => {
    if (tempGoalValue <= 0) {
      alert("Goal must be greater than 0");
      return;
    }

    const userId = session.user.id;

    let updateData = {};

    if (editingGoal === "daily") {
      updateData.daily_word_goal = tempGoalValue;
      setDailyWords((p) => ({ ...p, goal: tempGoalValue }));
    }

    if (editingGoal === "weekly") {
      updateData.weekly_revision_goal = tempGoalValue;
      setWeeklyRevisions((p) => ({ ...p, goal: tempGoalValue }));
    }

    if (editingGoal === "chat") {
      updateData.ai_chat_time_goal = tempGoalValue;
      setAiChatTime((p) => ({ ...p, goal: tempGoalValue }));
    }

    const { error } = await supabase
      .from("user_goals")
      .update(updateData)
      .eq("user_id", userId);

    if (error) {
      console.error(error);
      alert("Failed to update goal");
      return;
    }

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

  const isGoalCompleted = (completed, goal) => {
    return goal > 0 && completed >= goal;
  };

  return (
    <>
      <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-1">🎯 Learning Goals</h3>
        <p className="text-sm text-gray-400 mb-6">Track your daily progress</p>
        {/* 🎉 Congratulations Messages */}
        <div className="space-y-3 mb-6">
          {isGoalCompleted(dailyWords.completed, dailyWords.goal) && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 text-sm">
              🎉 Amazing! You completed your <strong>Daily Words</strong> goal!
            </div>
          )}

          {isGoalCompleted(weeklyRevisions.completed, weeklyRevisions.goal) && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-sm">
              🏆 Great job! You completed your <strong>Weekly Revisions</strong>{" "}
              goal!
            </div>
          )}

          {isGoalCompleted(aiChatTime.completed, aiChatTime.goal) && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 text-sm">
              🤖 Well done! You completed your <strong>AI Chat Time</strong>{" "}
              goal!
            </div>
          )}
        </div>

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
                style={{
                  width: `${calcPercentage(
                    dailyWords.completed,
                    dailyWords.goal
                  )}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {calcPercentage(dailyWords.completed, dailyWords.goal)}% of daily
              goal
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
                style={{
                  width: `${calcPercentage(
                    weeklyRevisions.completed,
                    weeklyRevisions.goal
                  )}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {calcPercentage(weeklyRevisions.completed, weeklyRevisions.goal)}%
              of weekly goal
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
                style={{
                  width: `${calcPercentage(
                    aiChatTime.completed,
                    aiChatTime.goal
                  )}%`,
                }}
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
              <h2 className="text-2xl font-bold text-white">
                {getGoalTitle()}
              </h2>
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
                  onChange={(e) =>
                    setTempGoalValue(parseInt(e.target.value) || 0)
                  }
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
                {editingGoal === "daily" &&
                  [5, 10, 15, 20].map((val) => (
                    <button
                      key={val}
                      onClick={() => setTempGoalValue(val)}
                      className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 text-xs font-medium transition-all"
                    >
                      {val} words
                    </button>
                  ))}
                {editingGoal === "weekly" &&
                  [10, 15, 20, 25].map((val) => (
                    <button
                      key={val}
                      onClick={() => setTempGoalValue(val)}
                      className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs font-medium transition-all"
                    >
                      {val} reviews
                    </button>
                  ))}
                {editingGoal === "chat" &&
                  [30, 60, 90, 120].map((val) => (
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
