import { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";

const SelfComparison = ({ session }) => {
  const [thisWeekCount, setThisWeekCount] = useState(0);
  const [lastWeekCount, setLastWeekCount] = useState(0);
  const [thisMonthCount, setThisMonthCount] = useState(0);
  const [lastMonthCount, setLastMonthCount] = useState(0);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchData = async () => {
      const { data, error } = await supabase
        .from("words")
        .select("created_at")
        .eq("user_id", session.user.id);

      if (error) {
        console.error(error);
        return;
      }

      const now = new Date();

      // ===== WEEK =====
      const currentDay = now.getDay() || 7; // Sunday = 7
      const startOfThisWeek = new Date(now);
      startOfThisWeek.setDate(now.getDate() - currentDay + 1);
      startOfThisWeek.setHours(0, 0, 0, 0);

      const startOfLastWeek = new Date(startOfThisWeek);
      startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

      const endOfLastWeek = new Date(startOfThisWeek);
      endOfLastWeek.setMilliseconds(-1);

      // ===== MONTH =====
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      let thisWeek = 0;
      let lastWeek = 0;
      let thisMonth = 0;
      let lastMonth = 0;

      data.forEach(({ created_at }) => {
        const created = new Date(created_at);

        if (created >= startOfThisWeek) thisWeek++;
        else if (created >= startOfLastWeek && created <= endOfLastWeek)
          lastWeek++;

        if (created >= startOfThisMonth) thisMonth++;
        else if (created >= startOfLastMonth && created <= endOfLastMonth)
          lastMonth++;
      });

      setThisWeekCount(thisWeek);
      setLastWeekCount(lastWeek);
      setThisMonthCount(thisMonth);
      setLastMonthCount(lastMonth);
    };

    fetchData();
  }, [session?.user?.id]);

  const calcPercentage = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return (
    <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-1">🆚 Your Progress</h3>
      <p className="text-sm text-gray-400 mb-6">Compare your performance</p>

      <div className="space-y-4">
        {/* This Week vs Last Week */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-white">
              This Week vs Last Week
            </h4>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                calcPercentage(thisWeekCount, lastWeekCount) >= 0
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {calcPercentage(thisWeekCount, lastWeekCount)}%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Last Week</p>
              <p className="text-2xl font-bold text-gray-500">
                {lastWeekCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">This Week</p>
              <p className="text-2xl font-bold text-green-400">
                {thisWeekCount}
              </p>
            </div>
          </div>
        </div>

        {/* This Month vs Last Month */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-white">
              This Month vs Last Month
            </h4>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                calcPercentage(thisMonthCount, lastMonthCount) >= 0
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {calcPercentage(thisMonthCount, lastMonthCount)}%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Last Month</p>
              <p className="text-2xl font-bold text-gray-500">
                {lastMonthCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">This Month</p>
              <p className="text-2xl font-bold text-green-400">
                {thisMonthCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfComparison;
