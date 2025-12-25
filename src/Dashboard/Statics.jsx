import { useEffect, useState } from "react";
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
import { UserAuth } from "../Authcontex";

const Statics = ({ words }) => {
  const { session } = UserAuth();
  // streak calculation function
  const calculateStreak = (words) => {
    if (!words || words.length === 0) return 0;

    // 1. استخراج الأيام الفريدة
    const daysSet = new Set(
      words.map((w) => {
        const d = new Date(w.created_at);
        d.setHours(0, 0, 0, 0); // تجاهل الوقت
        return d.getTime();
      })
    );

    // 2. ترتيب الأيام تنازليًا
    const days = Array.from(daysSet).sort((a, b) => b - a);

    let streak = 0;
    let currentDay = new Date();
    currentDay.setHours(0, 0, 0, 0);

    // 3. حساب الأيام المتتالية
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

  //learning activity chart
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

      // تهيئة الأيام
      const days = {};
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        days[key] = 0;
      }

      // تجميع الكلمات حسب اليوم
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

  // time spent
  const calculateAiChatTime = (messages) => {
    if (!messages || messages.length === 0) return 0;

    let minutes = 0;

    messages.forEach((row) => {
      const msg = row.message; // <-- row.message هو Object

      if (!msg) return;

      if (msg.type === "human") minutes += 0.2;
      if (msg.type === "ai") minutes += 1;
    });

    return Number(minutes.toFixed(1));
  };

  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const fetchChatMessages = async () => {
      const { data, error } = await supabase
        .from("linguaflow_chat_histories")
        .select("message")
        .eq("session_id", session.user.id);

      if (error) {
        console.error("Error fetching chat messages:", error);
        return;
      }

      setChatMessages(data || []);
    };

    if (session.user.id) fetchChatMessages();
  }, [session.user.id]);

  const aiMinutes = calculateAiChatTime(chatMessages);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Total Words */}
        <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-sky-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-400 text-sm font-medium">Total Words</h3>
            <BookOpen className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-4xl font-bold text-white mb-1">{words.length}</p>
          <p className="text-xs text-green-400">↑ All time</p>
        </div>

        {/* This Week */}
        <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-sky-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-400 text-sm font-medium">This Week</h3>
            <BarChart3 className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-4xl font-bold text-white mb-1">
            {
              words.filter((w) => {
                const wordDate = new Date(w.created_at);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return wordDate >= weekAgo;
              }).length
            }
          </p>
          <p className="text-xs text-green-400">↑ Last 7 days</p>
        </div>

        {/* This Month */}
        <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-sky-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-400 text-sm font-medium">This Month</h3>
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-4xl font-bold text-white mb-1">
            {
              words.filter((w) => {
                const wordDate = new Date(w.created_at);
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return wordDate >= monthAgo;
              }).length
            }
          </p>
          <p className="text-xs text-purple-400">↑ Last 30 days</p>
        </div>

        {/* Learning Streak */}
        <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-sky-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-400 text-sm font-medium">Streak</h3>
            <span className="text-2xl">🔥</span>
          </div>
          <p className="text-4xl font-bold text-white mb-1">
            {calculateStreak(words)}
          </p>
          <p className="text-xs text-orange-400">days in a row</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Learning Activity Chart */}
        <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                📈 Learning Activity
              </h3>
              <p className="text-sm text-gray-400">
                Words added per day (Last 7 days)
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {chartData.map(({ day, value }) => {
              const max = Math.max(...chartData.map((d) => d.value), 1);
              const percentage = (value / max) * 100;

              return (
                <div key={day} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 w-10">{day}</span>

                  <div className="flex-1 bg-[#0B0C10]/50 rounded-full h-8 overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-end pr-3 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    >
                      {value > 0 && (
                        <span className="text-xs font-bold text-white">
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

        {/* Time & Consistency Metrics */}
        <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-1">
            ⏱ Time Spent Learning
          </h3>
          <p className="text-sm text-gray-400 mb-6">This week</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">AI Chat</p>
                  <p className="text-xs text-gray-400">Interactive learning</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {aiMinutes}
                <span className="text-sm text-gray-400"> min</span>
              </p>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Revision</p>
                  <p className="text-xs text-gray-400">Review & practice</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                <span className="text-sm text-gray-400">will added in the future</span> 
                {/* 32<span className="text-sm text-gray-400">min</span> */}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-white">
                  🔥 Current Streak
                </p>
                <p className="text-2xl font-bold text-orange-400">
                  {calculateStreak(words)}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Longest: {calculateLongestStreak(words)} days</span>
                <span>
                  Missed:{" "}
                  {calculateLongestStreak(words) - calculateStreak(words)} days
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Driven Smart Insights */}
      <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              🤖 AI Weekly Insights
            </h3>
            <p className="text-sm text-gray-400">
              Personalized feedback from your learning patterns
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💪</span>
              <h4 className="font-semibold text-green-400">Strengths</h4>
            </div>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Strong with nouns</li>
              <li>• Good vocabulary retention</li>
              <li>• Consistent daily practice</li>
            </ul>
          </div>

          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⚠️</span>
              <h4 className="font-semibold text-orange-400">Needs Practice</h4>
            </div>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Verbs in past tense</li>
              <li>• Pronunciation accuracy</li>
              <li>• Complex sentences</li>
            </ul>
          </div>

          <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💡</span>
              <h4 className="font-semibold text-sky-400">Recommendations</h4>
            </div>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Focus on verb conjugation</li>
              <li>• Practice pronunciation daily</li>
              <li>• Review old words weekly</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-sm text-gray-300 leading-relaxed">
            <span className="font-semibold text-white">
              "You're doing great!
            </span>{" "}
            You remember nouns well, but verbs in past tense need more practice.
            Try using them in sentences with the AI chat. Keep up your 7-day
            streak! 🎯"
          </p>
        </div>
      </div>

      {/* Learning Goals & Comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Goals */}
        <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-1">
            🎯 Learning Goals
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Track your daily progress
          </p>

          <div className="space-y-5">
            {/* Daily Word Goal */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">
                  Daily Words
                </span>
                <span className="text-sm text-sky-400">5 / 10 words</span>
              </div>
              <div className="w-full bg-[#0B0C10]/50 rounded-full h-3 overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                  style={{ width: "50%" }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">50% of daily goal</p>
            </div>

            {/* Weekly Revision Goal */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">
                  Weekly Revisions
                </span>
                <span className="text-sm text-purple-400">8 / 15 reviews</span>
              </div>
              <div className="w-full bg-[#0B0C10]/50 rounded-full h-3 overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: "53%" }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">53% of weekly goal</p>
            </div>

            {/* Chat Time Goal */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">
                  AI Chat Time
                </span>
                <span className="text-sm text-green-400">45 / 60 min</span>
              </div>
              <div className="w-full bg-[#0B0C10]/50 rounded-full h-3 overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">75% of weekly goal</p>
            </div>
          </div>
        </div>

        {/* Self Comparison */}
        <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-1">
            🆚 Your Progress
          </h3>
          <p className="text-sm text-gray-400 mb-6">Compare your performance</p>

          <div className="space-y-4">
            {/* This Week vs Last Week */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-white">
                  This Week vs Last Week
                </h4>
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                  ↑ 23%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Last Week</p>
                  <p className="text-2xl font-bold text-gray-500">13</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">This Week</p>
                  <p className="text-2xl font-bold text-green-400">16</p>
                </div>
              </div>
            </div>

            {/* This Month vs Last Month */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-white">
                  This Month vs Last Month
                </h4>
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                  ↑ 35%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Last Month</p>
                  <p className="text-2xl font-bold text-gray-500">52</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">This Month</p>
                  <p className="text-2xl font-bold text-green-400">70</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">🏆 Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl text-center">
            <span className="text-4xl mb-2 block">🔥</span>
            <p className="font-bold text-white text-sm">7-Day Streak</p>
            <p className="text-xs text-gray-400 mt-1">Keep it up!</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-sky-500/20 to-blue-500/20 border border-sky-500/30 rounded-xl text-center">
            <span className="text-4xl mb-2 block">📚</span>
            <p className="font-bold text-white text-sm">50+ Words</p>
            <p className="text-xs text-gray-400 mt-1">Vocabulary Builder</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl text-center">
            <span className="text-4xl mb-2 block">⚡</span>
            <p className="font-bold text-white text-sm">Fast Learner</p>
            <p className="text-xs text-gray-400 mt-1">10 words in a day</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl text-center opacity-50">
            <span className="text-4xl mb-2 block">🎯</span>
            <p className="font-bold text-white text-sm">30-Day Learner</p>
            <p className="text-xs text-gray-400 mt-1">Locked (23 days left)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statics;
