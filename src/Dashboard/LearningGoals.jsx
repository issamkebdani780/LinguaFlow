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
    goal: 60,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [tempGoalValue, setTempGoalValue] = useState(0);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchData = async () => {
      setIsLoading(true);
      const userId = session.user.id;

      try {
        // Fetch user goals
        const { data: goalsData, error: goalsError } = await supabase
          .from("user_goals")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (goalsError && goalsError.code !== 'PGRST116') {
          console.error("Error fetching goals:", goalsError);
          setIsLoading(false);
          return;
        }

        if (!goalsData) {
          // No goals found, create default goals
          const { data: newGoals, error: insertError } = await supabase
            .from("user_goals")
            .insert({
              user_id: userId,
              daily_word_goal: 10,
              weekly_revision_goal: 15,
              ai_chat_time_goal: 60,
            })
            .select()
            .single();

          if (insertError) {
            console.error("Error creating default goals:", insertError);
            setIsLoading(false);
            return;
          }

          setDailyWords((p) => ({ ...p, goal: newGoals.daily_word_goal }));
          setWeeklyRevisions((p) => ({
            ...p,
            goal: newGoals.weekly_revision_goal,
          }));
          setAiChatTime((p) => ({ ...p, goal: newGoals.ai_chat_time_goal }));
        } else {
          // Goals found, update state
          setDailyWords((p) => ({ ...p, goal: goalsData.daily_word_goal }));
          setWeeklyRevisions((p) => ({
            ...p,
            goal: goalsData.weekly_revision_goal,
          }));
          setAiChatTime((p) => ({ ...p, goal: goalsData.ai_chat_time_goal }));
        }

        // Fetch today's words count
        const today = new Date();
        const startOfToday = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );

        const { data: wordsData, error: wordsError } = await supabase
          .from("words")
          .select("id")
          .eq("user_id", userId)
          .gte("created_at", startOfToday.toISOString());

        if (wordsError) {
          console.error("Error fetching words:", wordsError);
        } else {
          setDailyWords((p) => ({ ...p, completed: wordsData?.length || 0 }));
        }

        // Set weekly revisions to 0 (no revisions table yet)
        setWeeklyRevisions((p) => ({ ...p, completed: 0 }));

        // Update AI chat time
        setAiChatTime((p) => ({ ...p, completed: aiMinutes }));

        setIsLoading(false);
      } catch (error) {
        console.error("Unexpected error in fetchData:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.id, aiMinutes]);

  const calcPercentage = (completed, goal) => {
    if (goal === 0) return 0;
    return Math.min(Math.round((completed / goal) * 100), 100);
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

    if (!session?.user?.id) {
      alert("User session not found");
      return;
    }

    const userId = session.user.id;
    let updateData = {};

    if (editingGoal === "daily") {
      updateData.daily_word_goal = tempGoalValue;
    } else if (editingGoal === "weekly") {
      updateData.weekly_revision_goal = tempGoalValue;
    } else if (editingGoal === "chat") {
      updateData.ai_chat_time_goal = tempGoalValue;
    }

    try {
      const { error } = await supabase
        .from("user_goals")
        .update(updateData)
        .eq("user_id", userId);

      if (error) {
        console.error("Error updating goal:", error);
        alert("Failed to update goal. Please try again.");
        return;
      }

      // Update local state after successful database update
      if (editingGoal === "daily") {
        setDailyWords((p) => ({ ...p, goal: tempGoalValue }));
      } else if (editingGoal === "weekly") {
        setWeeklyRevisions((p) => ({ ...p, goal: tempGoalValue }));
      } else if (editingGoal === "chat") {
        setAiChatTime((p) => ({ ...p, goal: tempGoalValue }));
      }

      setIsEditModalOpen(false);
      setEditingGoal(null);
    } catch (error) {
      console.error("Unexpected error updating goal:", error);
      alert("An unexpected error occurred. Please try again.");
    }
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

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-1">🎯 Learning Goals</h3>
        <p className="text-sm text-gray-400 mb-6">Loading your progress...</p>
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-white/5 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-white/5 rounded-full w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
                  aria-label="Edit daily words goal"
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
                  aria-label="Edit weekly revisions goal"
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
                  aria-label="Edit AI chat time goal"
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
              aria-label="Close modal"
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