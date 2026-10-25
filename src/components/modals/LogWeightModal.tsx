import React, { useState } from 'react';
import { X, Scale, Heart, Smile, Sparkles, Check, Info } from 'lucide-react';
import { WeightLog } from '../../types';
import { saveWeightLog } from '../../utils/storage';

interface LogWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  selectedDate: string;
  currentWeight?: number;
  onWeightLogged: (log: WeightLog) => void;
}

export const LogWeightModal: React.FC<LogWeightModalProps> = ({
  isOpen,
  onClose,
  userId,
  selectedDate,
  currentWeight = 58,
  onWeightLogged,
}) => {
  const [weightKg, setWeightKg] = useState(currentWeight);
  const [waistCm, setWaistCm] = useState<string>('');
  const [hipCm, setHipCm] = useState<string>('');
  const [mood, setMood] = useState<'great' | 'good' | 'neutral' | 'low' | 'stressed'>('good');
  const [energyLevel, setEnergyLevel] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightKg || weightKg <= 20) return;

    const log: WeightLog = {
      id: `wlog-${Date.now()}`,
      userId,
      date: selectedDate,
      weightKg: Number(weightKg),
      waistCm: waistCm ? Number(waistCm) : undefined,
      hipCm: hipCm ? Number(hipCm) : undefined,
      mood,
      energyLevel,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    saveWeightLog(log);
    onWeightLogged(log);
    onClose();
  };

  const moods = [
    { id: 'great', label: 'Rất tuyệt', emoji: '✨' },
    { id: 'good', label: 'Tươi tắn', emoji: '😊' },
    { id: 'neutral', label: 'Bình thường', emoji: '🌿' },
    { id: 'low', label: 'Hơi mệt', emoji: '🥱' },
    { id: 'stressed', label: 'Căng thẳng', emoji: '💆' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 dark:border-stone-800">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Scale className="w-5 h-5" />
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Ghi nhận tiến trình thể trạng
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gentle Reminder Box */}
        <div className="my-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-[11px] text-rose-800 dark:text-rose-200 flex items-start gap-2">
          <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span>
            Cân nặng có thể dao động 0.5 - 1.5kg mỗi ngày do nước và tiêu hóa. Sự nhất quán về thói quen và cảm giác cơ thể mới là điều quan trọng nhất!
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Cân nặng hôm nay (kg)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-lg font-bold rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500 text-center"
              />
              <span className="absolute right-4 top-3.5 text-xs text-stone-400 font-bold">kg</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Vòng eo (cm, tùy chọn)
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="Ví dụ: 68"
                value={waistCm}
                onChange={(e) => setWaistCm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Vòng hông (cm, tùy chọn)
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="Ví dụ: 92"
                value={hipCm}
                onChange={(e) => setHipCm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          {/* Mood selection */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Tâm trạng hôm nay
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {moods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id as any)}
                  className={`py-2 px-1 rounded-xl border text-center transition-all ${
                    mood === m.id
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <span className="text-base block">{m.emoji}</span>
                  <span className="text-[10px] font-medium block mt-0.5 leading-tight">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy Rating 1-5 */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Mức năng lượng cơ thể: {energyLevel}/5 sao
            </label>
            <div className="flex items-center justify-between gap-1 p-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setEnergyLevel(lvl as any)}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                    energyLevel === lvl
                      ? 'bg-rose-600 text-white'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {lvl}★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Ghi chú thêm về cảm nhận
            </label>
            <textarea
              rows={2}
              placeholder="Ngủ ngon, cơ thể săn chắc hơn, quần áo mặc vừa vặn..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-200 dark:shadow-none transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Lưu chỉ số ngày {selectedDate}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
