import React, { useState } from 'react';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Flame,
  Plus,
  ChevronRight,
  Info,
} from 'lucide-react';
import { ExerciseLibraryItem, ExerciseLog } from '../../types';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';

interface ExerciseViewProps {
  selectedDate: string;
  exercises: ExerciseLog[];
  onOpenLogExercise: () => void;
  onRefreshData: () => void;
}

export const ExerciseView: React.FC<ExerciseViewProps> = ({
  selectedDate,
  exercises,
  onOpenLogExercise,
}) => {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseLibraryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredExercises = EXERCISE_LIBRARY.filter((ex) => {
    if (activeCategory === 'all') return true;
    return ex.category === activeCategory;
  });

  const dayExercises = exercises.filter((e) => e.date === selectedDate);

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Top Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Thư viện vận động & Bài tập
          </h2>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            Rèn luyện thể lực nhẹ nhàng, phù hợp với mọi thể trạng
          </span>
        </div>

        <button
          onClick={onOpenLogExercise}
          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ghi buổi tập</span>
        </button>
      </div>

      {/* Safety Guideline Card */}
      <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Nguyên tắc vàng:</strong> Luôn lắng nghe cơ thể. Dừng tập ngay khi cảm thấy chóng mặt, đau thắt ngực, khó thở bất thường hoặc khớp gối nhói buốt. Tập luyện để khỏe vui, không phải để tự trừng phạt bản thân.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { id: 'all', label: 'Tất cả bài tập' },
          { id: 'cardio', label: 'Cardio & Đi bộ' },
          { id: 'strength', label: 'Sức mạnh Bodyweight' },
          { id: 'flexibility', label: 'Yoga & Dãn cơ' },
          { id: 'recovery', label: 'Phục hồi vai gáy' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
              activeCategory === c.id
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Exercise Library List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredExercises.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedExercise(item)}
            className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-sm hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Mức độ: {item.level}
                </span>
                <span className="text-[10px] text-stone-400">
                  {item.recommendedDurationMin} phút
                </span>
              </div>

              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 transition-colors">
                {item.name}
              </h3>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5">
                Dụng cụ: {item.equipment}
              </span>
            </div>

            <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium text-[11px]">
                ~{(item.caloriesBurnPerMin * item.recommendedDurationMin).toFixed(0)} kcal
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 text-xs">
                Xem hướng dẫn
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Logged Workouts Today */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-sm space-y-3">
        <h3 className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center justify-between">
          <span>Đã tập luyện hôm nay ({selectedDate})</span>
          <span className="text-emerald-600 font-semibold">{dayExercises.length} hoạt động</span>
        </h3>

        {dayExercises.length > 0 ? (
          <div className="space-y-2">
            {dayExercises.map((e) => (
              <div
                key={e.id}
                className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-700/60 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                    {e.activityName}
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    {e.durationMinutes} phút · Cường độ: {e.intensity}
                    {e.distanceKm ? ` · ${e.distanceKm} km` : ''}
                  </span>
                </div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  ~{e.estimatedCalories} kcal
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-400 text-center py-3">
            Chưa có bài tập nào được ghi nhận hôm nay. Bấm nút "Ghi buổi tập" ở góc trên để bắt đầu!
          </p>
        )}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-rose-100 dark:border-stone-800 max-h-[90vh] overflow-y-auto space-y-4 text-xs">
            <div className="flex items-start justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <div>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">
                  Mức độ: {selectedExercise.level} · {selectedExercise.recommendedDurationMin} phút
                </span>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  {selectedExercise.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div>
              <span className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Dụng cụ cần thiết:
              </span>
              <p className="text-stone-600 dark:text-stone-400">{selectedExercise.equipment}</p>
            </div>

            <div>
              <span className="font-semibold text-stone-700 dark:text-stone-300 block mb-1.5">
                Hướng dẫn kỹ thuật động tác:
              </span>
              <div className="space-y-1.5">
                {selectedExercise.instructions.map((inst, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-stone-600 dark:text-stone-300 leading-relaxed">
                      {inst}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 text-rose-900 dark:text-rose-200 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4" />
                Cảnh báo dừng tập an toàn:
              </span>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                {selectedExercise.safeStoppingSigns.map((sign, i) => (
                  <li key={i}>{sign}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 font-semibold"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setSelectedExercise(null);
                  onOpenLogExercise();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Bắt đầu tập & Bấm giờ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
