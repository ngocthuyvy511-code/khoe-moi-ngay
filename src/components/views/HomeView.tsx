import React, { useMemo } from 'react';
import {
  Utensils,
  Droplets,
  Scale,
  Activity,
  Moon,
  Sparkles,
  Plus,
  CheckCircle2,
  Circle,
  ChevronRight,
  Flame,
  Heart,
  TrendingDown,
  Info,
} from 'lucide-react';
import {
  UserProfile,
  MealItem,
  WaterLog,
  SleepLog,
  ExerciseLog,
  WeightLog,
  HabitItem,
  HabitCompletion,
} from '../../types';
import { calculateMifflinStJeor, formatDurationHoursMinutes, displayWater } from '../../utils/nutrition';
import { toggleHabitCompletion } from '../../utils/storage';

interface HomeViewProps {
  user: UserProfile;
  selectedDate: string;
  meals: MealItem[];
  waters: WaterLog[];
  sleeps: SleepLog[];
  exercises: ExerciseLog[];
  weights: WeightLog[];
  habits: HabitItem[];
  habitCompletions: HabitCompletion[];
  onOpenAddMeal: () => void;
  onOpenAddWater: () => void;
  onOpenLogWeight: () => void;
  onOpenLogExercise: () => void;
  onOpenLogSleep: () => void;
  onOpenAiAssistant: () => void;
  onRefreshData: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  selectedDate,
  meals,
  waters,
  sleeps,
  exercises,
  weights,
  habits,
  habitCompletions,
  onOpenAddMeal,
  onOpenAddWater,
  onOpenLogWeight,
  onOpenLogExercise,
  onOpenLogSleep,
  onOpenAiAssistant,
  onRefreshData,
  onNavigateToTab,
}) => {
  // Time of day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Chào buổi sáng';
    if (hour < 14) return 'Chào buổi trưa';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  }, []);

  // Calculate Daily Nutrition Totals
  const dayMeals = useMemo(() => meals.filter((m: MealItem) => m.date === selectedDate), [meals, selectedDate]);

  const nutritionTotals = useMemo(() => {
    return dayMeals.reduce(
      (acc: { calories: number; protein: number; carbs: number; fat: number; fiber: number }, m: MealItem) => {
        acc.calories += m.calories || 0;
        acc.protein += m.protein || 0;
        acc.carbs += m.carbs || 0;
        acc.fat += m.fat || 0;
        acc.fiber += m.fiber || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  }, [dayMeals]);

  // Mifflin-St Jeor TDEE & Target
  const { targetCalories, assumptionNote, isSafeMode } = useMemo(
    () => calculateMifflinStJeor(user),
    [user]
  );

  // Daily Water Intake
  const dayWaters = useMemo(() => waters.filter((w: WaterLog) => w.date === selectedDate), [waters, selectedDate]);
  const totalWaterMl = useMemo(
    () => dayWaters.reduce((sum: number, w: WaterLog) => sum + w.amountMl, 0),
    [dayWaters]
  );
  const targetWaterMl = 2000;
  const waterPercent = Math.min(100, Math.round((totalWaterMl / targetWaterMl) * 100));

  // Daily Exercises
  const dayExercises = useMemo(() => exercises.filter((e: ExerciseLog) => e.date === selectedDate), [exercises, selectedDate]);
  const totalExerciseMins = useMemo(
    () => dayExercises.reduce((sum: number, e: ExerciseLog) => sum + e.durationMinutes, 0),
    [dayExercises]
  );
  const totalBurnedCalories = useMemo(
    () => dayExercises.reduce((sum: number, e: ExerciseLog) => sum + (e.estimatedCalories || 0), 0),
    [dayExercises]
  );

  // Latest Sleep (for selected date or night before)
  const currentSleep = useMemo(() => {
    return sleeps.find((s: SleepLog) => s.date === selectedDate) || sleeps[0] || null;
  }, [sleeps, selectedDate]);

  // Habit toggles
  const handleToggleHabit = (habitId: string) => {
    toggleHabitCompletion(user.id, habitId, selectedDate);
    onRefreshData();
  };

  const completedHabitCount = useMemo(() => {
    return habits.filter((h: HabitItem) => habitCompletions.some((c: HabitCompletion) => c.habitId === h.id && c.completed)).length;
  }, [habits, habitCompletions]);

  // Non-judgmental Next Action Suggestion
  const nextActionTip = useMemo(() => {
    const hour = new Date().getHours();
    if (totalWaterMl < 1000 && hour > 12) {
      return {
        title: 'Nạp thêm nước cho cơ thể',
        desc: 'Bạn đã uống được một phần nước trong ngày. Uống thêm 1 ly nước ấm để hỗ trợ tiêu hóa trưa nhé.',
        icon: '💧',
      };
    }
    if (dayExercises.length === 0 && hour > 16) {
      return {
        title: 'Thư giãn cơ thể nhẹ nhàng',
        desc: 'Một buổi đi bộ 20 phút hoặc bài tập dãn cơ văn phòng sẽ giúp giải tỏa căng thẳng sau giờ làm việc.',
        icon: '👟',
      };
    }
    return {
      title: 'Lắng nghe cơ thể bạn',
      desc: 'Ăn chậm, nhai kỹ và dừng lại khi cảm thấy vừa đủ no. Một ngày an lành bắt đầu từ những thói quen nhỏ.',
      icon: '🌿',
    };
  }, [totalWaterMl, dayExercises.length]);

  const hideCalories = user.displayPreferences?.hideCalories || isSafeMode;
  const hideWeight = user.displayPreferences?.hideWeight;

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* 1. Header Greeting & Affirmation */}
      <div className="px-1 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold mb-0.5">
            <span>{greeting}, {user.name}! 🌸</span>
          </div>
          <h2 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Khỏe đẹp từ thói quen mỗi ngày
          </h2>
        </div>

        {user.isDemo && (
          <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-semibold border border-amber-200 dark:border-amber-900/60">
            Dữ liệu minh họa
          </span>
        )}
      </div>

      {/* 2. Quick Action Buttons Bar */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onOpenAddMeal}
          className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-rose-100 dark:border-stone-700/80 shadow-sm hover:shadow-md hover:border-rose-300 dark:hover:border-rose-900/50 transition-all flex flex-col items-center text-center group min-h-[44px]"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Utensils className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-200">
            Ghi món ăn
          </span>
        </button>

        <button
          onClick={onOpenAddWater}
          className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-sky-100 dark:border-stone-700/80 shadow-sm hover:shadow-md hover:border-sky-300 dark:hover:border-sky-900/50 transition-all flex flex-col items-center text-center group min-h-[44px]"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-300 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Droplets className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-200">
            Thêm nước
          </span>
        </button>

        <button
          onClick={onOpenLogWeight}
          className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700/80 shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-900/50 transition-all flex flex-col items-center text-center group min-h-[44px]"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-300 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-200">
            Ghi thể trạng
          </span>
        </button>

        <button
          onClick={onOpenLogExercise}
          className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-emerald-100 dark:border-stone-700/80 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-900/50 transition-all flex flex-col items-center text-center group min-h-[44px]"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-200">
            Vận động
          </span>
        </button>
      </div>

      {/* 3. Daily Nutrition & Habit Focus Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-800 border border-rose-100 dark:border-stone-700/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              {hideCalories ? 'Dinh dưỡng cân bằng hôm nay' : 'Năng lượng & Dinh dưỡng hôm nay'}
            </h3>
          </div>
          <button
            onClick={() => onNavigateToTab('journal')}
            className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center"
          >
            Xem nhật ký ({dayMeals.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {hideCalories ? (
          <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 space-y-2">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 text-xs font-semibold">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Chế độ tập trung vào thói quen lành mạnh</span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
              Bạn đã ghi nhận <strong>{dayMeals.length} bữa ăn</strong> hôm nay. Ăn đúng giờ, nhai chậm và kết hợp đa dạng rau xanh, đạm nạc sẽ giúp cơ thể luôn sảng khoái mà không cần bận tâm về calo.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tabular-nums">
                  {nutritionTotals.calories}
                </span>
                <span className="text-xs text-stone-400 font-medium ml-1">
                  / {targetCalories || 1800} kcal tham khảo
                </span>
              </div>
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                {nutritionTotals.calories > (targetCalories || 1800)
                  ? 'Đủ năng lượng cho ngày dài'
                  : `Còn ~${Math.max(0, (targetCalories || 1800) - nutritionTotals.calories)} kcal`}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-100 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 to-rose-400 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (nutritionTotals.calories / (targetCalories || 1800)) * 100)}%`,
                }}
              ></div>
            </div>

            {/* Macronutrient Pills */}
            <div className="grid grid-cols-4 gap-2 pt-1 text-center">
              <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-700/60">
                <span className="text-[10px] text-stone-400 block">Đạm (Protein)</span>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 tabular-nums">
                  {nutritionTotals.protein}g
                </span>
              </div>
              <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-700/60">
                <span className="text-[10px] text-stone-400 block">Đường bột (Carbs)</span>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 tabular-nums">
                  {nutritionTotals.carbs}g
                </span>
              </div>
              <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-700/60">
                <span className="text-[10px] text-stone-400 block">Chất béo (Fat)</span>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 tabular-nums">
                  {nutritionTotals.fat}g
                </span>
              </div>
              <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-700/60">
                <span className="text-[10px] text-stone-400 block">Chất xơ</span>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 tabular-nums">
                  {nutritionTotals.fiber}g
                </span>
              </div>
            </div>

            <p className="text-[10px] text-stone-400 flex items-center gap-1">
              <Info className="w-3 h-3 shrink-0" />
              <span>{assumptionNote} Không tự cộng dồn toàn bộ calo tập luyện vào ngân sách ăn uống.</span>
            </p>
          </div>
        )}
      </div>

      {/* 4. Split Cards: Water & Workouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Water Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-sky-100 dark:border-stone-700/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                <Droplets className="w-4 h-4" />
                <span className="font-bold text-xs">Nước uống trong ngày</span>
              </div>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                {waterPercent}%
              </span>
            </div>

            <div className="my-2 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tabular-nums">
                {displayWater(totalWaterMl, user.displayPreferences?.unitSystem || 'metric')}
              </span>
              <span className="text-xs text-stone-400 font-medium">
                / {displayWater(targetWaterMl, user.displayPreferences?.unitSystem || 'metric')}
              </span>
            </div>

            <div className="w-full bg-sky-50 dark:bg-stone-700 h-2 rounded-full overflow-hidden my-2">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${waterPercent}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={onOpenAddWater}
            className="w-full mt-2 py-1.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm +250ml ly nước</span>
          </button>
        </div>

        {/* Workouts Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-emerald-100 dark:border-stone-700/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Activity className="w-4 h-4" />
                <span className="font-bold text-xs">Vận động thể chất</span>
              </div>
              <span className="text-[10px] text-stone-400 bg-stone-100 dark:bg-stone-700 px-1.5 py-0.5 rounded">
                Ghi nhận tay
              </span>
            </div>

            <div className="my-2 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tabular-nums">
                {totalExerciseMins}
              </span>
              <span className="text-xs text-stone-400 font-medium">phút tập luyện</span>
            </div>

            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {dayExercises.length > 0
                ? `${dayExercises.map((e: ExerciseLog) => e.activityName).join(', ')} (~${totalBurnedCalories} kcal)`
                : 'Chưa có hoạt động nào được ghi nhận hôm nay.'}
            </p>
          </div>

          <button
            onClick={onOpenLogExercise}
            className="w-full mt-2 py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Bắt đầu bài tập mới</span>
          </button>
        </div>
      </div>

      {/* 5. Sleep & Rest Card */}
      {currentSleep && (
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-indigo-100 dark:border-stone-700/80 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                  Giấc ngủ đêm qua
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.2 rounded font-semibold">
                  {currentSleep.qualityRating}/5 sao
                </span>
              </div>
              <span className="text-xs text-stone-600 dark:text-stone-300 font-medium block">
                {currentSleep.bedTime} - {currentSleep.wakeTime} ({formatDurationHoursMinutes(currentSleep.durationMinutes)})
              </span>
              {currentSleep.feelings && (
                <span className="text-[11px] text-stone-400 block -mt-0.5">
                  {currentSleep.feelings}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onOpenLogSleep}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Chỉnh sửa
          </button>
        </div>
      )}

      {/* 6. Daily Habits Checklist */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-800 border border-rose-100 dark:border-stone-700/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Thói quen hôm nay ({completedHabitCount}/{habits.length})
            </h3>
          </div>
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
            {completedHabitCount === habits.length && habits.length > 0 ? 'Tuyệt vời! 🌟' : 'Nhất quán từng ngày'}
          </span>
        </div>

        <div className="space-y-2">
          {habits.map((habit: HabitItem) => {
            const isDone = habitCompletions.some(
              (c: HabitCompletion) => c.habitId === habit.id && c.completed
            );
            return (
              <div
                key={habit.id}
                onClick={() => handleToggleHabit(habit.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isDone
                    ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200'
                    : 'bg-stone-50 dark:bg-stone-900/50 border-stone-200/80 dark:border-stone-700 hover:border-rose-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-400 shrink-0" />
                  )}
                  <div>
                    <span
                      className={`text-xs font-semibold block ${
                        isDone ? 'line-through opacity-80' : 'text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      {habit.title}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {habit.categoryLabel} {habit.reminderTime ? `· Nhắc ${habit.reminderTime}` : ''}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-medium text-stone-400">
                  {isDone ? 'Đã hoàn thành' : 'Chạm để hoàn thành'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Gentle Next Action Recommendation Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-tr from-rose-50 to-orange-50 dark:from-stone-800 dark:to-stone-800/80 border border-rose-100 dark:border-stone-700/80 flex items-start gap-3">
        <span className="text-2xl">{nextActionTip.icon}</span>
        <div className="flex-1">
          <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 mb-0.5">
            Gợi ý hành động tiếp theo · {nextActionTip.title}
          </h4>
          <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
            {nextActionTip.desc}
          </p>
        </div>
      </div>
    </div>
  );
};
