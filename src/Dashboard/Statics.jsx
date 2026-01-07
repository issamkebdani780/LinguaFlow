// src/components/Statics.jsx
import { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";
import {
  Bot,
  BookOpen,
  BarChart3,
  TrendingUp,
  Zap,
  Award,
  Target,
  Clock,
} from "lucide-react";
import { UserAuth } from "../Authcontex";
import SelfComparison from "./SelfComparison";
import LearningGoals from "./LearningGoals";
import Achievements from "./Achievements";

const Statics = ({ words }) => {
  const { session } = UserAuth();

  // Streak calculation function
  const calculateStreak = (words) => {
    if (!words || words.length === 0) return 0;

    const daysSet = new Set(
      words.map((w) => {
        const d = new Date(w.created_at);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    );

    const days = Array.from(daysSet).sort((a, b) => b - a);
    let streak = 0;
    let currentDay = new Date();
    currentDay.setHours(0, 0, 0, 0);

    for (let day of days) {
      if (day === currentDay.getTime()) {
        streak++;
        currentDay.setDate(currentDay.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateLongestStreak = (words) => {
    if (!words || words.length === 0) return 0;

    const days = Array.from(
      new Set(
        words.map((w) => {
          const d = new Date(w.created_at);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
      )
    ).sort((a, b) => a - b);

    let longest = 1;
    let current = 1;

    for (let i = 1; i < days.length; i++) {
      const diff = (days[i] - days[i - 1]) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 1;
      }
    }

    return longest;
  };

  // Learning activity chart
  const [activity, setActivity] = useState({});
  useEffect(() => {
    const fetchActivity = async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("words")
        .select("created_at")
        .eq("user_id", session.user.id)
        .gte("created_at", sevenDaysAgo.toISOString());

      if (error) {
        console.error(error);
        return;
      }

      const days = {};
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        days[key] = 0;
      }

      data.forEach((item) => {
        const day = item.created_at.slice(0, 10);
        if (days[day] !== undefined) {
          days[day]++;
        }
      });

      setActivity(days);
    };

    fetchActivity();
  }, [session.user.id]);

  const chartData = Object.entries(activity)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, count]) => {
      const dayName = new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
      });
      return { day: dayName, value: count };
    });

  // Time spent
  const calculateAiChatTime = (messages) => {
    if (!messages || messages.length === 0) return 0;

    let minutes = 0;

    messages.forEach((row) => {
      if (!row.message) return;

      let msg;
      try {
        msg = JSON.parse(row.message);
      } catch (e) {
        console.error("Invalid JSON message:", row.message);
        return;
      }

      if (msg.role === "user") minutes += 0.2;
      if (msg.role === "assistant") minutes += 0.4;
    });

    return Number(minutes.toFixed(1));
  };

  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const fetchChatMessages = async () => {
      const { data, error } = await supabase
        .from("linguaflow_chat_histories")
        .select("message")
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Error fetching chat messages:", error);
        return;
      }

      setChatMessages(data || []);
    };

    fetchChatMessages();
  }, [session.user.id]);

  const aiMinutes = calculateAiChatTime(chatMessages);
  const longestStreak = calculateLongestStreak(words);
  const streak = calculateStreak(words);

  const weekWords = words.filter((w) => {
    const wordDate = new Date(w.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return wordDate >= weekAgo;
  }).length;

  const monthWords = words.filter((w) => {
    const wordDate = new Date(w.created_at);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return wordDate >= monthAgo;
  }).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-500/20 via-rose-500/20 to-orange-500/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-600 rounded-2xl blur-xl opacity-50" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-600 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Learning Statistics</h1>
              <p className="text-gray-400">Track your progress and achievements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Words */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 hover:border-sky-400/40 rounded-2xl p-6 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-all" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">Total Words</h3>
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-2">{words.length}</p>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-green-400">All time</span>
            </div>
          </div>
        </div>

        {/* This Week */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 hover:border-green-400/40 rounded-2xl p-6 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-all" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">This Week</h3>
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-2">{weekWords}</p>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-green-400">Last 7 days</span>
            </div>
          </div>
        </div>

        {/* This Month */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 hover:border-purple-400/40 rounded-2xl p-6 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">This Month</h3>
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-2">{monthWords}</p>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-purple-400" />
              <span className="text-purple-400">Last 30 days</span>
            </div>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 hover:border-orange-400/40 rounded-2xl p-6 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">Current Streak</h3>
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-2">{streak}</p>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-orange-400">days in a row</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Learning Activity Chart */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Learning Activity</h3>
                <p className="text-sm text-gray-400">Words added per day (Last 7 days)</p>
              </div>
            </div>

            <div className="space-y-3">
              {chartData.map(({ day, value }) => {
                const max = Math.max(...chartData.map((d) => d.value), 1);
                const percentage = (value / max) * 100;

                return (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-400 w-10">{day}</span>
                    <div className="flex-1 bg-[#0B0C10]/60 rounded-full h-10 overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 flex items-center justify-end pr-3 transition-all duration-700 ease-out"
                        style={{ width: `${percentage}%` }}
                      >
                        {value > 0 && (
                          <span className="text-sm font-bold text-white">
                            {value}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Time & Consistency Metrics */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Time Spent Learning</h3>
                <p className="text-sm text-gray-400">This week</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative overflow-hidden group p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl hover:border-emerald-400/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">AI Chat</p>
                      <p className="text-xs text-gray-400">Interactive learning</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {aiMinutes}
                    <span className="text-sm text-gray-400 ml-1">min</span>
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden group p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl hover:border-purple-400/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Revision</p>
                      <p className="text-xs text-gray-400">Review & practice</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 italic">Coming soon</p>
                </div>
              </div>

              <div className="relative overflow-hidden p-5 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <p className="text-sm font-semibold text-white">Current Streak</p>
                  </div>
                  <p className="text-3xl font-bold text-orange-400">{streak}</p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Longest: <span className="text-orange-400 font-semibold">{longestStreak}</span> days</span>
                  <span className="text-gray-400">
                    Missed: <span className="text-red-400 font-semibold">{longestStreak - streak}</span> days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Goals & Comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        <LearningGoals session={session} aiMinutes={aiMinutes} />
        <SelfComparison session={session} />
      </div>

      {/* Achievement Badges */}
      <Achievements
        session={session}
        words={words}
        longestStreak={longestStreak}
      />
    </div>
  );
};

export default Statics;