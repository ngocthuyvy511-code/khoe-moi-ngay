import React, { useState, useMemo } from 'react';
import {
  Utensils,
  Plus,
  Trash2,
  Copy,
  Undo2,
  Sparkles,
  Info,
  Calendar,
  Clock,
  Camera,
  ChevronRight,
} from 'lucide-react';
import { MealItem, MealType } from '../../types';
import { deleteMeal, saveMeal } from '../../utils/storage';

interface JournalViewProps {
  selectedDate: string;
  meals: MealItem[];
  userId: string;
  onOpenAddMeal: (mealType?: MealType) => void;
  onOpenCopyModal: () => void;
  onRefreshData: () => void;
  hideCalories?: boolean;
}

export const JournalView: React.FC<JournalViewProps> = ({
  selectedDate,
  meals,
  userId,
  onOpenAddMeal,
  onOpenCopyModal,
  onRefreshData,
  hideCalories = false,
}) => {
  const [deletedMealBackup, setDeletedMealBackup] = useState<MealItem | null>(null);
  const [undoToastVisible, setUndoToastVisible] = useState(false);

  const dayMeals = useMemo(() => meals.filter((m) => m.date === selectedDate), [meals, selectedDate]);

  // Group by mealType
  const groupedMeals = useMemo(() => {
    const map: Record<MealType, MealItem[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };
    dayMeals.forEach((m) => {
      if (map[m.mealType]) {
        map[m.mealType].push(m);
      } else {
        map.snack.push(m);
      }
    });
    return map;
  }, [dayMeals]);

  // Daily totals
  const dayTotals = useMemo(() => {
    return dayMeals.reduce(
      (acc, m) => {
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

  // Delete Meal with Undo
  const handleDeleteMeal = (mealId: string) => {
    const deleted = deleteMeal(mealId, userId);
    if (deleted) {
      setDeletedMealBackup(deleted);
      setUndoToastVisible(true);
      onRefreshData();

      setTimeout(() => {
        setUndoToastVisible(false);
      }, 5000);
    }
  };

  const handleUndoDelete = () => {
    if (deletedMealBackup) {
      saveMeal(deletedMealBackup);
      setDeletedMealBackup(null);
      setUndoToastVisible(false);
      onRefreshData();
    }
  };

  const mealSections: Array<{ type: MealType; title: string; time: string; emoji: string }> = [
    { type: 'breakfast', title: 'Bữa Sáng', time: '06:30 - 08:30', emoji: '🍳' },
    { type: 'lunch', title: 'Bữa Trưa', time: '11:30 - 13:00', emoji: '🍱' },
    { type: 'dinner', title: 'Bữa Tối', time: '18:00 - 20:00', emoji: '🍲' },
    { type: 'snack', title: 'Bữa Phụ & Thức Uống', time: 'Trong ngày', emoji: '🍎' },
  ];

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Top Header & Copy Action */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Nhật ký ăn uống
          </h2>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            Ngày: {selectedDate} · {dayMeals.length} món đã ghi nhận
          </span>
        </div>

        <button
          onClick={onOpenCopyModal}
          disabled={dayMeals.length === 0}
          className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-40 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Copy className="w-3.5 h-3.5 text-rose-500" />
          <span>Sao chép thực đơn</span>
        </button>
      </div>

      {/* Daily Nutrition Totals Banner */}
      {!hideCalories && (
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-rose-100 dark:border-stone-700/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-400 font-semibold uppercase block">
              Tổng năng lượng đã nạp
            </span>
            <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tabular-nums">
              {dayTotals.calories}{' '}
              <span className="text-xs font-semibold text-rose-500">kcal</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-right text-xs">
            <div>
              <span className="text-[10px] text-stone-400 block">Đạm</span>
              <span className="font-bold text-stone-800 dark:text-stone-200 tabular-nums">
                {dayTotals.protein.toFixed(1)}g
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 block">Carbs</span>
              <span className="font-bold text-stone-800 dark:text-stone-200 tabular-nums">
                {dayTotals.carbs.toFixed(1)}g
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 block">Béo</span>
              <span className="font-bold text-stone-800 dark:text-stone-200 tabular-nums">
                {dayTotals.fat.toFixed(1)}g
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Undo Toast Notification */}
      {undoToastVisible && deletedMealBackup && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 p-3 rounded-2xl bg-stone-900 text-white shadow-xl flex items-center justify-between animate-in slide-in-from-bottom-5">
          <span className="text-xs truncate max-w-[220px]">
            Đã xóa: {deletedMealBackup.name}
          </span>
          <button
            onClick={handleUndoDelete}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Hoàn tác</span>
          </button>
        </div>
      )}

      {/* Meal Sections: Breakfast, Lunch, Dinner, Snack */}
      <div className="space-y-4">
        {mealSections.map((section) => {
          const items = groupedMeals[section.type];
          const sectionCalories = items.reduce((sum, i) => sum + (i.calories || 0), 0);

          return (
            <div
              key={section.type}
              className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-sm space-y-3"
            >
              {/* Section Header */}
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-700/60">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{section.emoji}</span>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      {section.title}
                    </h3>
                    <span className="text-[10px] text-stone-400">{section.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!hideCalories && (
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                      {sectionCalories} kcal
                    </span>
                  )}
                  <button
                    onClick={() => onOpenAddMeal(section.type)}
                    className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                    title={`Thêm món vào ${section.title}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items List */}
              {items.length > 0 ? (
                <div className="space-y-2.5">
                  {items.map((meal) => (
                    <div
                      key={meal.id}
                      className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-700/60 flex items-start justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-2.5">
                        {meal.photoUrl ? (
                          <img
                            src={meal.photoUrl}
                            alt={meal.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-stone-800 text-stone-400 flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-700">
                            <Utensils className="w-4 h-4 text-stone-500" />
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                              {meal.name}
                            </span>
                            {meal.isAiEstimated && (
                              <span className="text-[9px] bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" /> AI
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                            {meal.portionQuantity}x {meal.portionUnit}
                            {meal.servingGrams ? ` (~${meal.servingGrams}g)` : ''}
                          </span>
                          {meal.notes && (
                            <span className="text-[10px] text-stone-400 italic block mt-0.5">
                              "{meal.notes}"
                            </span>
                          )}
                          <span className="text-[9px] text-stone-400 block mt-0.5">
                            Nguồn: {meal.source}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-right">
                        <div>
                          {!hideCalories && (
                            <span className="font-bold text-xs text-rose-600 dark:text-rose-400 block tabular-nums">
                              {meal.calories} kcal
                            </span>
                          )}
                          <span className="text-[10px] text-stone-400 block tabular-nums">
                            P: {meal.protein}g · C: {meal.carbs}g · F: {meal.fat}g
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteMeal(meal.id)}
                          className="opacity-40 group-hover:opacity-100 hover:text-rose-600 p-1 rounded-lg transition-opacity"
                          title="Xóa món này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-stone-400 text-xs">
                  <p>Chưa ghi nhận món ăn nào trong bữa này.</p>
                  <button
                    onClick={() => onOpenAddMeal(section.type)}
                    className="text-rose-600 dark:text-rose-400 font-semibold underline text-xs mt-1 inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thêm món vào {section.title}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
