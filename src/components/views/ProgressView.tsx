import React, { useState, useMemo } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Scale,
  Calendar,
  Sparkles,
  Info,
  Heart,
  Smile,
  Shield,
  Plus,
} from 'lucide-react';
import { WeightLog, UserProfile, MealItem, WaterLog, SleepLog, ExerciseLog } from '../../types';
import { calculateAsianBmi, displayWeight } from '../../utils/nutrition';

interface ProgressViewProps {
  user: UserProfile;
  weights: WeightLog[];
  meals: MealItem[];
  waters: WaterLog[];
  sleeps: SleepLog[];
  exercises: ExerciseLog[];
  onOpenLogWeight: () => void;
  hideWeight?: boolean;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  user,
  weights,
  meals,
  waters,
  sleeps,
  exercises,
  onOpenLogWeight,
  hideWeight = false,
}) => {
  const [filterRange, setFilterRange] = useState<'week' | 'month' | 'all'>('month');

  // Filter weights by range
  const filteredWeights = useMemo(() => {
    if (weights.length === 0) return [];
    const sorted = [...weights].sort((a, b) => a.date.localeCompare(b.date));
    if (filterRange === 'week') return sorted.slice(-7);
    if (filterRange === 'month') return sorted.slice(-30);
    return sorted;
  }, [weights, filterRange]);

  // Current weight and initial weight
  const currentWeight = weights.length > 0 ? weights[weights.length - 1].weightKg : user.currentWeight;
  const initialWeight = weights.length > 0 ? weights[0].weightKg : user.currentWeight;
  const weightDelta = parseFloat((currentWeight - initialWeight).toFixed(1));

  // BMI Asian Pacific
  const { bmi, category, badgeColor, disclaimer } = useMemo(() => {
    return calculateAsianBmi(currentWeight, user.height);
  }, [currentWeight, user.height]);

  // SVG Chart Dimensions & Path Generation
  const chartData = useMemo(() => {
    if (filteredWeights.length < 2) return null;

    const values = filteredWeights.map((w) => w.weightKg);
    const minW = Math.min(...values) - 0.5;
    const maxW = Math.max(...values) + 0.5;
    const range = maxW - minW || 1;

    const width = 360;
    const height = 140;
    const padding = 20;

    const points = filteredWeights.map((item, idx) => {
      const x = padding + (idx / (filteredWeights.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((item.weightKg - minW) / range) * (height - 2 * padding);
      return { x, y, weight: item.weightKg, date: item.date };
    });

    const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

    return { points, pathD, width, height, minW, maxW };
  }, [filteredWeights]);

  // Weekly Neutral Holistic Summary
  const weeklySummary = useMemo(() => {
    const last7DaysMeals = meals.length;
    const avgSleepMins =
      sleeps.length > 0
        ? Math.round(sleeps.reduce((sum, s) => sum + s.durationMinutes, 0) / sleeps.length)
        : 450;
    const totalWorkoutMins = exercises.reduce((sum, e) => sum + e.durationMinutes, 0);

    return {
      loggedDays: Math.min(7, Math.max(1, new Set(meals.map((m) => m.date)).size)),
      avgSleepText: `${Math.floor(avgSleepMins / 60)}h ${avgSleepMins % 60}p`,
      totalWorkoutMins,
      commentary:
        weightDelta < 0
          ? `Bạn đang duy trì nhịp độ ổn định. Mức giảm ${Math.abs(weightDelta)}kg diễn ra nhẹ nhàng, bảo toàn cơ bắp và tràn đầy năng lượng.`
          : 'Cơ thể đang thích nghi và xây dựng thói quen. Hãy tiếp tục ưu tiên giấc ngủ chất lượng, uống đủ nước và vận động vui tươi mỗi ngày.',
    };
  }, [meals, sleeps, exercises, weightDelta]);

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Top Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Tiến trình & Báo cáo sức khỏe
          </h2>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            Theo dõi sự thay đổi bền vững, tôn trọng cơ thể
          </span>
        </div>

        <button
          onClick={onOpenLogWeight}
          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ghi thể trạng</span>
        </button>
      </div>

      {/* 1. Weight Chart & Metrics (Hidden if user opted to hide weight) */}
      {!hideWeight ? (
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-stone-400 font-semibold uppercase block">
                Cân nặng hiện tại
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tabular-nums">
                  {displayWeight(currentWeight, user.displayPreferences?.unitSystem || 'metric')}
                </span>
                {weightDelta !== 0 && (
                  <span
                    className={`text-xs font-bold flex items-center gap-0.5 ${
                      weightDelta < 0 ? 'text-emerald-600' : 'text-stone-500'
                    }`}
                  >
                    {weightDelta < 0 ? (
                      <TrendingDown className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingUp className="w-3.5 h-3.5" />
                    )}
                    {Math.abs(weightDelta)} kg so với ban đầu
                  </span>
                )}
              </div>
            </div>

            {/* Range Filter */}
            <div className="flex bg-stone-100 dark:bg-stone-900 p-1 rounded-xl text-xs font-semibold">
              {(['week', 'month', 'all'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRange(r)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterRange === r
                      ? 'bg-white dark:bg-stone-700 text-rose-600 dark:text-rose-300 shadow-sm'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {r === 'week' ? 'Tuần' : r === 'month' ? 'Tháng' : 'Tất cả'}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Trend Chart */}
          {chartData ? (
            <div className="w-full overflow-x-auto">
              <svg viewBox={`0 0 ${chartData.width} ${chartData.height}`} className="w-full h-36">
                <defs>
                  <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E11D48" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#E11D48" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line
                  x1="20"
                  y1="20"
                  x2="340"
                  y2="20"
                  stroke="currentColor"
                  className="text-stone-100 dark:text-stone-800"
                  strokeDasharray="4 4"
                />
                <line
                  x1="20"
                  y1="70"
                  x2="340"
                  y2="70"
                  stroke="currentColor"
                  className="text-stone-100 dark:text-stone-800"
                  strokeDasharray="4 4"
                />
                <line
                  x1="20"
                  y1="120"
                  x2="340"
                  y2="120"
                  stroke="currentColor"
                  className="text-stone-100 dark:text-stone-800"
                  strokeDasharray="4 4"
                />

                {/* Path */}
                <path
                  d={chartData.pathD}
                  fill="none"
                  stroke="#E11D48"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {chartData.points.map((p, idx) => (
                  <g key={idx}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      className="fill-white dark:fill-stone-900 stroke-rose-600 stroke-[2.5]"
                    />
                    <text
                      x={p.x}
                      y={p.y - 8}
                      textAnchor="middle"
                      className="text-[9px] fill-stone-500 font-semibold"
                    >
                      {p.weight}
                    </text>
                  </g>
                ))}
              </svg>

              <div className="flex justify-between text-[10px] text-stone-400 px-3 -mt-1 font-medium">
                <span>{filteredWeights[0].date}</span>
                <span>{filteredWeights[filteredWeights.length - 1].date}</span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-stone-400 text-xs">
              <Scale className="w-8 h-8 mx-auto mb-1 text-stone-300" />
              <p>Hãy ghi nhận thêm ít nhất 2 lần để hiển thị biểu đồ xu hướng.</p>
            </div>
          )}

          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-700/60 text-[11px] text-stone-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>Biểu đồ phản ánh xu hướng thực tế; những ngày không nhập dữ liệu không bị coi là giá trị bằng 0.</span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-3xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-200">
          <p className="font-semibold mb-0.5">Bạn đang bật chế độ ẩn thông tin cân nặng</p>
          <p className="text-[11px] text-stone-600 dark:text-stone-300">
            Ứng dụng tôn trọng quyết định của bạn để tập trung vào cảm nhận cơ thể và các thói quen lành mạnh mỗi ngày.
          </p>
        </div>
      )}

      {/* 2. Asian-Pacific BMI & Limitations Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
              Chỉ số khối cơ thể (BMI Châu Á)
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${badgeColor}`}>
              {category}
            </span>
          </div>
          <span className="text-base font-extrabold text-stone-900 dark:text-stone-100 tabular-nums">
            {bmi}
          </span>
        </div>

        {/* BMI Range bar */}
        <div className="w-full bg-stone-100 dark:bg-stone-700 h-2 rounded-full overflow-hidden flex">
          <div className="bg-amber-400 h-full w-[25%]" title="Dưới 18.5: Nhẹ cân"></div>
          <div className="bg-emerald-500 h-full w-[45%]" title="18.5 - 22.9: Cân đối"></div>
          <div className="bg-orange-400 h-full w-[15%]" title="23 - 24.9: Tiền thừa cân"></div>
          <div className="bg-rose-500 h-full w-[15%]" title=">= 25: Chú ý"></div>
        </div>

        <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-relaxed italic">
          💡 {disclaimer}
        </p>
      </div>

      {/* 3. Weekly Holistic Summary Report */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-tr from-rose-50/80 via-white to-sky-50/50 dark:from-stone-800 dark:to-stone-800/80 border border-rose-100 dark:border-stone-700/80 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-500" />
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
            Tổng kết tuần này của bạn
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-700/60">
            <span className="text-[10px] text-stone-400 block">Số ngày ghi chép</span>
            <span className="font-bold text-sm text-stone-800 dark:text-stone-200">
              {weeklySummary.loggedDays}/7 ngày
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-700/60">
            <span className="text-[10px] text-stone-400 block">Giấc ngủ trung bình</span>
            <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
              {weeklySummary.avgSleepText}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-700/60">
            <span className="text-[10px] text-stone-400 block">Tổng thời gian tập</span>
            <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
              {weeklySummary.totalWorkoutMins} phút
            </span>
          </div>
        </div>

        <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed bg-white/70 dark:bg-stone-900/60 p-3 rounded-2xl border border-rose-100/60 dark:border-stone-700/60">
          {weeklySummary.commentary}
        </p>
      </div>

      {/* 4. Measurements History (Waist, Hip, Mood) */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-sm space-y-3">
        <h3 className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center justify-between">
          <span>Lịch sử số đo vòng eo & Cảm xúc</span>
          <span className="text-[10px] text-stone-400 font-normal">Riêng tư tuyệt đối</span>
        </h3>

        <div className="space-y-2">
          {weights
            .slice(-4)
            .reverse()
            .map((w) => (
              <div
                key={w.id}
                className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-700/60 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    {w.date}
                  </span>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-2 mt-0.5">
                    {w.waistCm && <span>Eo: {w.waistCm} cm</span>}
                    {w.hipCm && <span>Hông: {w.hipCm} cm</span>}
                    {w.energyLevel && <span>Năng lượng: {w.energyLevel}/5★</span>}
                  </div>
                </div>

                <div className="text-right">
                  {!hideWeight && (
                    <span className="font-bold text-rose-600 dark:text-rose-400 block tabular-nums">
                      {w.weightKg} kg
                    </span>
                  )}
                  {w.mood && (
                    <span className="text-[10px] text-stone-400 capitalize">{w.mood}</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
