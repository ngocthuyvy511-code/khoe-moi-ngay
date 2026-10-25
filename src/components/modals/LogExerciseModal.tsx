import React, { useState, useEffect } from 'react';
import { X, Activity, Play, Pause, RotateCcw, Check, Clock, Flame } from 'lucide-react';
import { ExerciseLog } from '../../types';
import { saveExerciseLog } from '../../utils/storage';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';

interface LogExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  selectedDate: string;
  onExerciseLogged: (log: ExerciseLog) => void;
}

export const LogExerciseModal: React.FC<LogExerciseModalProps> = ({
  isOpen,
  onClose,
  userId,
  selectedDate,
  onExerciseLogged,
}) => {
  const [activityType, setActivityType] = useState<
    'walking' | 'running' | 'cycling' | 'swimming' | 'yoga' | 'strength' | 'custom'
  >('walking');
  const [activityName, setActivityName] = useState('Đi bộ nhanh ngoài trời');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [intensity, setIntensity] = useState<'light' | 'moderate' | 'vigorous'>('moderate');
  const [distanceKm, setDistanceKm] = useState<string>('2.0');
  const [notes, setNotes] = useState('');

  // Live Stopwatch State
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setStopwatchSeconds((sec) => sec + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  if (!isOpen) return null;

  // Preset activities
  const activityPresets = [
    { type: 'walking', name: 'Đi bộ nhanh', rate: 5.2 },
    { type: 'running', name: 'Chạy bộ nhịp tim nhẹ', rate: 8.5 },
    { type: 'cycling', name: 'Đạp xe thư giãn', rate: 6.8 },
    { type: 'swimming', name: 'Bơi lội tự do', rate: 8.0 },
    { type: 'yoga', name: 'Yoga dãn cơ phục hồi', rate: 3.2 },
    { type: 'strength', name: 'Rèn luyện sức mạnh Bodyweight', rate: 6.0 },
  ];

  const estimatedCalories = Math.round(
    durationMinutes *
      (intensity === 'light' ? 4 : intensity === 'moderate' ? 6.5 : 9)
  );

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleStopAndApplyTimer = () => {
    setIsTimerRunning(false);
    const mins = Math.max(1, Math.round(stopwatchSeconds / 60));
    setDurationMinutes(mins);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const log: ExerciseLog = {
      id: `ex-${Date.now()}`,
      userId,
      date: selectedDate,
      activityType,
      activityName: activityName.trim() || 'Vận động thể chất',
      durationMinutes: Number(durationMinutes),
      intensity,
      distanceKm: distanceKm ? Number(distanceKm) : undefined,
      estimatedCalories,
      notes: notes.trim() || undefined,
      isDeviceSynced: false,
      createdAt: new Date().toISOString(),
    };

    saveExerciseLog(log);
    onExerciseLogged(log);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-rose-100 dark:border-stone-800 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Activity className="w-5 h-5" />
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Ghi nhận vận động thể chất
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Stopwatch Card */}
        <div className="my-3 p-3.5 rounded-2xl bg-stone-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-semibold tracking-wider block">
              Bộ đếm thời gian tập trực tiếp
            </span>
            <span className="text-2xl font-bold font-mono tracking-wider tabular-nums">
              {formatTimer(stopwatchSeconds)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {!isTimerRunning ? (
              <button
                type="button"
                onClick={() => setIsTimerRunning(true)}
                className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white"
                title="Bắt đầu"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsTimerRunning(false)}
                className="p-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white"
                title="Tạm dừng"
              >
                <Pause className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setIsTimerRunning(false);
                setStopwatchSeconds(0);
              }}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300"
              title="Đặt lại"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            {stopwatchSeconds > 0 && (
              <button
                type="button"
                onClick={handleStopAndApplyTimer}
                className="px-2 py-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-semibold"
              >
                Lấy số phút
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Quick Activity Pickers */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Chọn nhanh loại hoạt động
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {activityPresets.map((p) => (
                <button
                  key={p.type}
                  type="button"
                  onClick={() => {
                    setActivityType(p.type as any);
                    setActivityName(p.name);
                  }}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    activityType === p.type
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <span className="font-semibold block text-[11px] truncate">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Tên hoạt động
            </label>
            <input
              type="text"
              required
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Thời lượng (phút)
              </label>
              <input
                type="number"
                min="1"
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Quãng đường (km, nếu có)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="2.5"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          {/* Intensity Selector */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Cường độ cảm nhận
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: 'Nhẹ nhàng', desc: 'Vừa tập vừa nói chuyện dễ' },
                { id: 'moderate', label: 'Vừa phải', desc: 'Hơi thở sâu, tim đập nhanh' },
                { id: 'vigorous', label: 'Nhiệt tình', desc: 'Ra nhiều mồ hôi, thở dốc' },
              ].map((i) => (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => setIntensity(i.id as any)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    intensity === i.id
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-semibold'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <span className="block text-xs">{i.label}</span>
                  <span className="block text-[9px] text-stone-400 mt-0.5">{i.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Calorie estimate banner */}
          <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 text-orange-900 dark:text-orange-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Năng lượng tiêu hao ước tính:</span>
            </div>
            <span className="font-bold text-orange-600 dark:text-orange-400 tabular-nums">
              ~{estimatedCalories} kcal
            </span>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Ghi chú về buổi tập
            </label>
            <input
              type="text"
              placeholder="Thời tiết đẹp, cơ thể thoải mái..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-200 dark:shadow-none transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Lưu buổi vận động vào nhật ký</span>
          </button>
        </form>
      </div>
    </div>
  );
};
