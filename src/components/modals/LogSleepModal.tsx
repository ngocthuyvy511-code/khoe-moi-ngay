import React, { useState, useMemo } from 'react';
import { X, Moon, Clock, Check, Sparkles } from 'lucide-react';
import { SleepLog } from '../../types';
import { saveSleepLog } from '../../utils/storage';
import { calculateSleepDurationMinutes, formatDurationHoursMinutes } from '../../utils/nutrition';

interface LogSleepModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  selectedDate: string;
  onSleepLogged: (log: SleepLog) => void;
}

export const LogSleepModal: React.FC<LogSleepModalProps> = ({
  isOpen,
  onClose,
  userId,
  selectedDate,
  onSleepLogged,
}) => {
  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('06:30');
  const [qualityRating, setQualityRating] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [feelings, setFeelings] = useState('Tỉnh táo, sảng khoái khi thức giấc');
  const [notes, setNotes] = useState('');

  const durationMinutes = useMemo(() => {
    return calculateSleepDurationMinutes(bedTime, wakeTime);
  }, [bedTime, wakeTime]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const log: SleepLog = {
      id: `sleep-${Date.now()}`,
      userId,
      date: selectedDate,
      bedTime,
      wakeTime,
      durationMinutes,
      qualityRating,
      feelings,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    saveSleepLog(log);
    onSleepLogged(log);
    onClose();
  };

  const ratings = [
    { lvl: 1, label: 'Rất mệt mỏi', emoji: '😫' },
    { lvl: 2, label: 'Hơi thiếu ngủ', emoji: '🥱' },
    { lvl: 3, label: 'Bình thường', emoji: '😐' },
    { lvl: 4, label: 'Ngủ ngon giấc', emoji: '😌' },
    { lvl: 5, label: 'Tràn đầy sinh lực', emoji: '⚡' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 dark:border-stone-800">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Moon className="w-5 h-5" />
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Ghi nhận giấc ngủ đêm qua
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 my-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Giờ lên giường ngủ
              </label>
              <input
                type="time"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Giờ thức dậy
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold"
              />
            </div>
          </div>

          {/* Calculated Duration Display */}
          <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-stone-700 dark:text-stone-300 font-medium">
                Tổng thời lượng ngủ (qua đêm):
              </span>
            </div>
            <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
              {formatDurationHoursMinutes(durationMinutes)}
            </span>
          </div>

          {/* Quality Rating */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Chất lượng giấc ngủ
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {ratings.map((r) => (
                <button
                  key={r.lvl}
                  type="button"
                  onClick={() => setQualityRating(r.lvl as any)}
                  className={`py-2 px-1 rounded-xl border text-center transition-all ${
                    qualityRating === r.lvl
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <span className="text-base block">{r.emoji}</span>
                  <span className="text-[9px] font-medium block mt-0.5 leading-tight">
                    {r.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Cảm giác lúc thức dậy
            </label>
            <input
              type="text"
              value={feelings}
              onChange={(e) => setFeelings(e.target.value)}
              placeholder="Ví dụ: Tỉnh táo, mắt nhẹ nhõm, không bị uể oải..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Ghi chú thêm (yếu tố hỗ trợ giấc ngủ)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ví dụ: Tắm nước ấm, đọc sách 15 phút, phòng ngủ mát mẻ..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Lưu giấc ngủ vào nhật ký</span>
          </button>
        </form>
      </div>
    </div>
  );
};
